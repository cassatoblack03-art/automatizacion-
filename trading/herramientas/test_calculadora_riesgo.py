"""Pruebas de la calculadora. Ejecutar: python3 -m unittest test_calculadora_riesgo -v"""

import csv
import io
import math
import os
import tempfile
import unittest
import unittest.mock
from contextlib import redirect_stdout

import calculadora_riesgo as cr


class TestTamanoPosicion(unittest.TestCase):
    def test_forex_eurusd(self):
        # 1.000 USD, 1 % = 10 USD, stop de 30 pips, 10 USD/pip por lote -> 0.033 -> 0.03
        res = cr.tamano_posicion(1000, 1, 1.0850, 1.0820, contrato=100_000, paso=0.01)
        self.assertEqual(res["direccion"], "COMPRA")
        self.assertEqual(res["tamano"], 0.03)
        self.assertAlmostEqual(res["riesgo_real"], 9.0, places=6)

    def test_acciones(self):
        res = cr.tamano_posicion(5000, 1, 100, 96, contrato=1, paso=1)
        self.assertEqual(res["tamano"], 12)
        self.assertAlmostEqual(res["riesgo_real"], 48.0)

    def test_oro_venta(self):
        res = cr.tamano_posicion(3000, 1, 2400, 2406, contrato=100, paso=0.01)
        self.assertEqual(res["direccion"], "VENTA")
        self.assertEqual(res["tamano"], 0.05)

    def test_conversion_jpy(self):
        # USDJPY a 150, stop de 0.30 (30 pips), cuenta USD: 1 pip/lote ~ 6.67 USD
        res = cr.tamano_posicion(10_000, 1, 150.00, 149.70, contrato=100_000,
                                 conversion=1 / 150, paso=0.01)
        self.assertEqual(res["tamano"], 0.5)

    def test_nunca_redondea_hacia_arriba(self):
        res = cr.tamano_posicion(1000, 1, 1.0850, 1.0821, contrato=100_000, paso=0.01)
        self.assertLessEqual(res["riesgo_real"], res["riesgo_dinero"])

    def test_paso_no_decimal(self):
        self.assertEqual(cr._redondear_abajo(0.74, 0.25), 0.5)
        self.assertEqual(cr._redondear_abajo(0.75, 0.25), 0.75)

    def test_errores(self):
        with self.assertRaises(ValueError):
            cr.tamano_posicion(1000, 1, 1.0850, 1.0850)
        with self.assertRaises(ValueError):
            cr.tamano_posicion(0, 1, 1.0850, 1.0820)
        with self.assertRaises(ValueError):
            cr.tamano_posicion(1000, 150, 1.0850, 1.0820)


class TestObjetivos(unittest.TestCase):
    def test_rr(self):
        objs = cr.evaluar_objetivos(1.0850, 1.0820, [1.0880, 1.0910])
        self.assertAlmostEqual(objs[0]["rr"], 1.0)
        self.assertAlmostEqual(objs[1]["rr"], 2.0)

    def test_tp_lado_equivocado(self):
        with self.assertRaises(ValueError):
            cr.evaluar_objetivos(1.0850, 1.0820, [1.0800])


class TestDiario(unittest.TestCase):
    def test_calcular_r(self):
        self.assertAlmostEqual(cr.calcular_r({"resultado_R": "1,5"}), 1.5)
        compra = {"direccion": "compra", "entrada": "100", "stop": "95", "salida": "110"}
        self.assertAlmostEqual(cr.calcular_r(compra), 2.0)
        venta = {"direccion": "sell", "entrada": "100", "stop": "105", "salida": "105"}
        self.assertAlmostEqual(cr.calcular_r(venta), -1.0)
        self.assertIsNone(cr.calcular_r({"direccion": "compra", "entrada": "100"}))

    def test_metricas(self):
        m = cr.metricas([2, -1, -1, -1, 3, 0])
        self.assertEqual(m["operaciones"], 6)
        self.assertEqual(m["ganadoras"], 2)
        self.assertEqual(m["breakeven"], 1)
        self.assertAlmostEqual(m["expectativa_R"], 2 / 6)
        self.assertAlmostEqual(m["profit_factor"], 5 / 3)
        self.assertEqual(m["max_drawdown_R"], 3)
        self.assertEqual(m["max_racha_perdedora"], 3)

    def test_sin_perdidas(self):
        self.assertTrue(math.isinf(cr.metricas([1, 2])["profit_factor"]))

    def test_plantilla_csv(self):
        ruta = os.path.join(os.path.dirname(__file__), "..", "plantillas", "diario-de-trading.csv")
        salida = io.StringIO()
        with redirect_stdout(salida):
            self.assertEqual(cr.main(["estadisticas", ruta]), 0)
        self.assertIn("RESUMEN GENERAL", salida.getvalue())

    def test_csv_con_plan_y_setup(self):
        contenido = (
            "fecha,setup,direccion,entrada,stop,salida,resultado_R,seguiste_plan\n"
            "2026-01-01,A,compra,100,95,110,,si\n"
            "2026-01-02,B,venta,100,105,105,,no\n"
            "2026-01-03,A,,,,,0.5,sí\n"
        )
        with tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False,
                                         encoding="utf-8") as fh:
            fh.write(contenido)
        try:
            with open(fh.name, encoding="utf-8") as f:
                analisis = cr.analizar_diario(list(csv.DictReader(f)))
        finally:
            os.unlink(fh.name)
        self.assertEqual(analisis.con_plan, [2.0, 0.5])
        self.assertEqual(analisis.sin_plan, [-1.0])
        self.assertEqual(sorted(analisis.por_setup), ["A", "B"])


class TestSimulacion(unittest.TestCase):
    def test_siempre_gana(self):
        r = cr.simular(100, 2, 1, trades=10, simulaciones=10, semilla=1)
        self.assertEqual(r["pct_en_perdida"], 0)
        self.assertEqual(r["racha_p95"], 0)
        self.assertAlmostEqual(r["final_mediana"], 10_000 * 1.02 ** 10)

    def test_reproducible(self):
        a = cr.simular(45, 2, 1, trades=50, simulaciones=200, semilla=42)
        b = cr.simular(45, 2, 1, trades=50, simulaciones=200, semilla=42)
        self.assertEqual(a, b)
        self.assertAlmostEqual(a["expectativa_R"], 0.35)
        self.assertAlmostEqual(a["winrate_equilibrio"], 100 / 3)


class TestCLI(unittest.TestCase):
    def test_tamano_stop_demasiado_amplio(self):
        salida = io.StringIO()
        with redirect_stdout(salida):
            cr.main(["tamano", "--mercado", "forex", "--balance", "100", "--riesgo", "1",
                     "--entrada", "1.0850", "--stop", "1.0750"])
        self.assertIn("NO operes", salida.getvalue())

    def test_error_devuelve_1(self):
        with redirect_stdout(io.StringIO()), \
                unittest.mock.patch("sys.stderr", new_callable=io.StringIO):
            self.assertEqual(cr.main(["tamano", "--balance", "100", "--entrada", "1",
                                      "--stop", "1"]), 1)


if __name__ == "__main__":
    unittest.main()
