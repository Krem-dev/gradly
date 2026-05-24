/**
 * Tests that verify the eval() RCE vulnerability is gone from
 * gradeConversionConfig.service.applyFormula.
 *
 * The original implementation used `eval(formula.formula_expression.replace('score', score))`
 * — anyone with write access to conversion_formulas could execute arbitrary code.
 */

const service = require('../services/gradeConversionConfig.service')

// Reach into the private safeEvalLinear via the service's applyFormula behaviour.
// We can't import the helper directly without a refactor, so we exercise the API
// by stubbing the DB query. Use the module's getConversionFormula override.

describe('gradeConversionConfig — safeEvalLinear (no RCE)', () => {
  let originalGetFormula

  beforeAll(() => {
    originalGetFormula = service.getConversionFormula.bind(service)
  })

  afterAll(() => {
    service.getConversionFormula = originalGetFormula
  })

  function stubFormula(formula) {
    service.getConversionFormula = async () =>
      formula === null
        ? { success: true, data: null }
        : { success: true, data: { ...formula, is_active: true } }
  }

  test('direct returns score unchanged', async () => {
    stubFormula({ formula_type: 'direct', formula_expression: null })
    const r = await service.applyFormula('whatever', 'usa_gpa', 3.5)
    expect(r).toBe(3.5)
  })

  test('linear "(score / 5) * 4" works correctly', async () => {
    stubFormula({ formula_type: 'linear', formula_expression: '(score / 5) * 4' })
    expect(await service.applyFormula('x', 'y', 5)).toBe(4)
    expect(await service.applyFormula('x', 'y', 2.5)).toBe(2)
  })

  test('linear "score * 0.8" works correctly', async () => {
    stubFormula({ formula_type: 'linear', formula_expression: 'score * 0.8' })
    expect(await service.applyFormula('x', 'y', 100)).toBe(80)
  })

  test('REJECTS RCE attempts (function calls)', async () => {
    stubFormula({
      formula_type: 'linear',
      // Old eval() would crash or execute this; we want a safe null.
      formula_expression: 'require("child_process").execSync("touch /tmp/pwned")',
    })
    const r = await service.applyFormula('x', 'y', 1)
    expect(r).toBeNull()
  })

  test('REJECTS RCE via process global', async () => {
    stubFormula({ formula_type: 'linear', formula_expression: 'process.exit(1)' })
    const r = await service.applyFormula('x', 'y', 1)
    expect(r).toBeNull()
  })

  test('REJECTS comment-out tricks', async () => {
    stubFormula({ formula_type: 'linear', formula_expression: 'score; console.log("rce")' })
    const r = await service.applyFormula('x', 'y', 1)
    expect(r).toBeNull()
  })

  test('REJECTS template literal injection', async () => {
    stubFormula({ formula_type: 'linear', formula_expression: '`${score}`.constructor.constructor("return 1")()' })
    const r = await service.applyFormula('x', 'y', 1)
    expect(r).toBeNull()
  })
})
