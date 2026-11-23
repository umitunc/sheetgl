import { describe, it, expect } from 'vitest';
import {
  ColumnColorEngine,
  COLUMN_COLOR_PRESET_LIST,
  COLUMN_COLOR_PALETTES,
} from '../../src/datagrid/theme/ColumnColorEngine';
import { ColumnDef, ColumnGroupDef } from '../../src/datagrid/types/grid';

describe('ColumnColorEngine', () => {
  describe('Presets and Palettes Definition', () => {
    it('should define all 13 standard column color presets with valid TR/EN labels and swatches', () => {
      expect(COLUMN_COLOR_PRESET_LIST.length).toBe(13);
      for (const preset of COLUMN_COLOR_PRESET_LIST) {
        expect(preset.id).toBeDefined();
        expect(preset.labelTR).toBeDefined();
        expect(preset.labelEN).toBeDefined();
        expect(preset.swatch).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(COLUMN_COLOR_PALETTES[preset.id]).toBeDefined();
      }
    });

    it('should have complete dual-theme palette tokens for each preset', () => {
      for (const [key, palette] of Object.entries(COLUMN_COLOR_PALETTES)) {
        expect(palette.light.groupHeaderBg).toBeDefined();
        expect(palette.light.groupHeaderText).toBeDefined();
        expect(palette.light.headerBg).toBeDefined();
        expect(palette.light.headerText).toBeDefined();
        expect(palette.light.headerAccent).toBeDefined();
        expect(palette.light.columnBg).toBeDefined();

        expect(palette.dark.groupHeaderBg).toBeDefined();
        expect(palette.dark.groupHeaderText).toBeDefined();
        expect(palette.dark.headerBg).toBeDefined();
        expect(palette.dark.headerText).toBeDefined();
        expect(palette.dark.headerAccent).toBeDefined();
        expect(palette.dark.columnBg).toBeDefined();
      }
    });
  });

  describe('isPreset', () => {
    it('should return true for valid semantic presets', () => {
      expect(ColumnColorEngine.isPreset('blue')).toBe(true);
      expect(ColumnColorEngine.isPreset('emerald')).toBe(true);
      expect(ColumnColorEngine.isPreset('rose')).toBe(true);
      expect(ColumnColorEngine.isPreset('slate')).toBe(true);
    });

    it('should return false for invalid presets, numbers, or objects', () => {
      expect(ColumnColorEngine.isPreset('unknownColor')).toBe(false);
      expect(ColumnColorEngine.isPreset('')).toBe(false);
      expect(ColumnColorEngine.isPreset(123)).toBe(false);
      expect(ColumnColorEngine.isPreset(null)).toBe(false);
      expect(ColumnColorEngine.isPreset({})).toBe(false);
    });
  });

  describe('getPresetTokens', () => {
    it('should return light tokens when isDark is false', () => {
      const tokens = ColumnColorEngine.getPresetTokens('emerald', false);
      expect(tokens).toEqual(COLUMN_COLOR_PALETTES.emerald.light);
      expect(tokens.headerAccent).toBe('#10B981');
    });

    it('should return dark tokens when isDark is true', () => {
      const tokens = ColumnColorEngine.getPresetTokens('emerald', true);
      expect(tokens).toEqual(COLUMN_COLOR_PALETTES.emerald.dark);
      expect(tokens.headerAccent).toBe('#10B981');
    });

    it('should fallback to blue preset for unknown preset key', () => {
      const tokens = ColumnColorEngine.getPresetTokens('nonexistent' as any, false);
      expect(tokens).toEqual(COLUMN_COLOR_PALETTES.blue.light);
    });
  });

  describe('resolveColorValue', () => {
    it('should return undefined when input is undefined, null, or empty string', () => {
      expect(ColumnColorEngine.resolveColorValue(undefined, false)).toBeUndefined();
      expect(ColumnColorEngine.resolveColorValue('' as any, false)).toBeUndefined();
      expect(ColumnColorEngine.resolveColorValue('   ' as any, false)).toBeUndefined();
    });

    it('should resolve theme-aware { light, dark } object', () => {
      const input = { light: '#F0FDF4', dark: '#064E3B' };
      expect(ColumnColorEngine.resolveColorValue(input, false)).toBe('#F0FDF4');
      expect(ColumnColorEngine.resolveColorValue(input, true)).toBe('#064E3B');
    });

    it('should resolve semantic preset string to role tokens', () => {
      // Role: headerAccent
      const accent = ColumnColorEngine.resolveColorValue('amber', false, 'headerAccent');
      expect(accent).toBe(COLUMN_COLOR_PALETTES.amber.light.headerAccent);

      // Role: groupHeaderBg in dark mode
      const bgDark = ColumnColorEngine.resolveColorValue('amber', true, 'groupHeaderBg');
      expect(bgDark).toBe(COLUMN_COLOR_PALETTES.amber.dark.groupHeaderBg);
    });

    it('should adapt custom 6-digit hex color for headerBg and groupHeaderBg roles', () => {
      const customHex = '#2563EB';

      // Light mode blends with pastel white
      const lightBg = ColumnColorEngine.resolveColorValue(customHex, false, 'headerBg');
      expect(lightBg).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);

      // Dark mode creates subtle rgba
      const darkBg = ColumnColorEngine.resolveColorValue(customHex, true, 'headerBg');
      expect(darkBg).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.09\)$/);
    });

    it('should support short 3-digit hex strings (e.g. #f00)', () => {
      const resolved = ColumnColorEngine.resolveColorValue('#f00', false, 'headerBg');
      expect(resolved).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
    });

    it('should return raw string when not a recognized hex or preset', () => {
      const namedColor = 'transparent';
      expect(ColumnColorEngine.resolveColorValue(namedColor, false)).toBe('transparent');
    });
  });

  describe('resolveGroupStyle', () => {
    it('should return empty object when group is undefined', () => {
      expect(ColumnColorEngine.resolveGroupStyle(undefined, false)).toEqual({});
    });

    it('should resolve group style from preset color', () => {
      const group: ColumnGroupDef = {
        id: 'finance',
        title: 'Financials',
        color: 'emerald',
      };

      const styleLight = ColumnColorEngine.resolveGroupStyle(group, false);
      expect(styleLight.groupHeaderBg).toBe(COLUMN_COLOR_PALETTES.emerald.light.groupHeaderBg);
      expect(styleLight.groupHeaderText).toBe(COLUMN_COLOR_PALETTES.emerald.light.groupHeaderText);
      expect(styleLight.headerAccent).toBe(COLUMN_COLOR_PALETTES.emerald.light.headerAccent);

      const styleDark = ColumnColorEngine.resolveGroupStyle(group, true);
      expect(styleDark.groupHeaderBg).toBe(COLUMN_COLOR_PALETTES.emerald.dark.groupHeaderBg);
      expect(styleDark.groupHeaderText).toBe(COLUMN_COLOR_PALETTES.emerald.dark.groupHeaderText);
    });

    it('should respect custom group style overrides over base preset', () => {
      const group: ColumnGroupDef = {
        id: 'sales',
        title: 'Sales Team',
        color: 'blue',
        style: {
          groupHeaderBg: '#FEF08A',
          groupHeaderText: '#713F12',
        },
      };

      const style = ColumnColorEngine.resolveGroupStyle(group, false);
      expect(style.groupHeaderText).toBe('#713F12');
    });
  });

  describe('resolveColumnStyle', () => {
    it('should resolve column style from column color preset', () => {
      const col: ColumnDef = {
        id: 'revenue',
        title: 'Revenue',
        type: 'currency',
        width: 120,
        color: 'green',
      };

      const style = ColumnColorEngine.resolveColumnStyle(col, undefined, false);
      expect(style.headerBg).toBe(COLUMN_COLOR_PALETTES.green.light.headerBg);
      expect(style.headerAccent).toBe(COLUMN_COLOR_PALETTES.green.light.headerAccent);
      expect(style.columnBg).toBe(COLUMN_COLOR_PALETTES.green.light.columnBg);
    });

    it('should inherit colors from parent column group when inheritColumnColors is true', () => {
      const group: ColumnGroupDef = {
        id: 'hr',
        title: 'HR Dept',
        color: 'purple',
        inheritColumnColors: true,
      };

      const col: ColumnDef = {
        id: 'salary',
        title: 'Salary',
        type: 'currency',
        width: 120,
      };

      const style = ColumnColorEngine.resolveColumnStyle(col, group, false);
      expect(style.headerBg).toBe(COLUMN_COLOR_PALETTES.purple.light.headerBg);
      expect(style.headerAccent).toBe(COLUMN_COLOR_PALETTES.purple.light.headerAccent);
    });

    it('should not inherit from parent group when inheritColumnColors is explicitly false', () => {
      const group: ColumnGroupDef = {
        id: 'ops',
        title: 'Operations',
        color: 'indigo',
        inheritColumnColors: false,
      };

      const col: ColumnDef = {
        id: 'status',
        title: 'Status',
        type: 'text',
        width: 100,
      };

      const style = ColumnColorEngine.resolveColumnStyle(col, group, false);
      expect(style.headerBg).toBeUndefined();
      expect(style.headerAccent).toBeUndefined();
    });

    it('should prioritize column-level color overrides over inherited group colors', () => {
      const group: ColumnGroupDef = {
        id: 'marketing',
        title: 'Marketing',
        color: 'rose',
      };

      const col: ColumnDef = {
        id: 'clicks',
        title: 'Clicks',
        type: 'number',
        width: 80,
        color: 'teal',
      };

      const style = ColumnColorEngine.resolveColumnStyle(col, group, false);
      expect(style.headerAccent).toBe(COLUMN_COLOR_PALETTES.teal.light.headerAccent);
    });
  });
});
