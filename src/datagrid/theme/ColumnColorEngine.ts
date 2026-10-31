import {
  ColumnColorConfig,
  ColumnColorPreset,
  ColumnDef,
  ColumnGroupDef,
  ThemeAwareColor,
} from '../types/grid';

export interface ResolvedPaletteTokens {
  groupHeaderBg: string;
  groupHeaderText: string;
  groupHeaderBorder: string;
  headerBg: string;
  headerText: string;
  headerAccent: string;
  columnBg: string;
  columnText?: string;
}

export interface DualThemePalette {
  light: ResolvedPaletteTokens;
  dark: ResolvedPaletteTokens;
}

export interface ResolvedGroupHeaderStyle {
  headerBg?: string;
  headerText?: string;
  headerAccent?: string;
  borderColor?: string;
  groupHeaderBg?: string;
  groupHeaderText?: string;
  groupHeaderBorder?: string;
  accentColor?: string;
}

export type ResolvedColumnGroupStyle = ResolvedGroupHeaderStyle;

export interface ResolvedColumnStyle {
  headerBg?: string;
  headerText?: string;
  headerAccent?: string;
  columnBg?: string;
  columnText?: string;
  borderColor?: string;
}

export const COLUMN_COLOR_PRESET_LIST: Array<{
  id: ColumnColorPreset;
  labelTR: string;
  labelEN: string;
  swatch: string;
}> = [
  { id: 'blue', labelTR: 'Mavi (Blue)', labelEN: 'Blue', swatch: '#3B82F6' },
  { id: 'indigo', labelTR: 'Çivit (Indigo)', labelEN: 'Indigo', swatch: '#6366F1' },
  { id: 'violet', labelTR: 'Menekşe (Violet)', labelEN: 'Violet', swatch: '#8B5CF6' },
  { id: 'purple', labelTR: 'Mor (Purple)', labelEN: 'Purple', swatch: '#A855F7' },
  { id: 'emerald', labelTR: 'Zümrüt (Emerald)', labelEN: 'Emerald', swatch: '#10B981' },
  { id: 'green', labelTR: 'Yeşil (Green)', labelEN: 'Green', swatch: '#22C55E' },
  { id: 'teal', labelTR: 'Turkuaz (Teal)', labelEN: 'Teal', swatch: '#14B8A6' },
  { id: 'cyan', labelTR: 'Camgöbeği (Cyan)', labelEN: 'Cyan', swatch: '#06B6D4' },
  { id: 'amber', labelTR: 'Kehribar (Amber)', labelEN: 'Amber', swatch: '#F59E0B' },
  { id: 'orange', labelTR: 'Turuncu (Orange)', labelEN: 'Orange', swatch: '#F97316' },
  { id: 'rose', labelTR: 'Gül (Rose)', labelEN: 'Rose', swatch: '#F43F5E' },
  { id: 'red', labelTR: 'Kırmızı (Red)', labelEN: 'Red', swatch: '#EF4444' },
  { id: 'slate', labelTR: 'Arduvaz (Slate)', labelEN: 'Slate', swatch: '#64748B' },
];

export const COLUMN_COLOR_PALETTES: Record<ColumnColorPreset, DualThemePalette> = {
  blue: {
    light: {
      groupHeaderBg: '#EFF6FF',
      groupHeaderText: '#1E40AF',
      groupHeaderBorder: '#DBEAFE',
      headerBg: '#F8FAFF',
      headerText: '#1D4ED8',
      headerAccent: '#3B82F6',
      columnBg: 'rgba(59, 130, 246, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(30, 64, 175, 0.22)',
      groupHeaderText: '#93C5FD',
      groupHeaderBorder: 'rgba(59, 130, 246, 0.30)',
      headerBg: 'rgba(30, 58, 138, 0.14)',
      headerText: '#BFDBFE',
      headerAccent: '#3B82F6',
      columnBg: 'rgba(59, 130, 246, 0.03)',
    },
  },
  indigo: {
    light: {
      groupHeaderBg: '#EEF2FF',
      groupHeaderText: '#3730A3',
      groupHeaderBorder: '#E0E7FF',
      headerBg: '#F8F9FF',
      headerText: '#4338CA',
      headerAccent: '#6366F1',
      columnBg: 'rgba(99, 102, 241, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(55, 48, 163, 0.22)',
      groupHeaderText: '#A5B4FC',
      groupHeaderBorder: 'rgba(99, 102, 241, 0.30)',
      headerBg: 'rgba(49, 46, 129, 0.14)',
      headerText: '#C7D2FE',
      headerAccent: '#6366F1',
      columnBg: 'rgba(99, 102, 241, 0.03)',
    },
  },
  violet: {
    light: {
      groupHeaderBg: '#F5F3FF',
      groupHeaderText: '#5B21B6',
      groupHeaderBorder: '#EDE9FE',
      headerBg: '#FAF9FF',
      headerText: '#6D28D9',
      headerAccent: '#8B5CF6',
      columnBg: 'rgba(139, 92, 246, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(91, 33, 182, 0.22)',
      groupHeaderText: '#C4B5FD',
      groupHeaderBorder: 'rgba(139, 92, 246, 0.30)',
      headerBg: 'rgba(76, 29, 149, 0.14)',
      headerText: '#DDD6FE',
      headerAccent: '#8B5CF6',
      columnBg: 'rgba(139, 92, 246, 0.03)',
    },
  },
  purple: {
    light: {
      groupHeaderBg: '#FAF5FF',
      groupHeaderText: '#6B21A8',
      groupHeaderBorder: '#F3E8FF',
      headerBg: '#FDFAFF',
      headerText: '#7E22CE',
      headerAccent: '#A855F7',
      columnBg: 'rgba(168, 85, 247, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(107, 33, 168, 0.22)',
      groupHeaderText: '#D8B4FE',
      groupHeaderBorder: 'rgba(168, 85, 247, 0.30)',
      headerBg: 'rgba(88, 28, 135, 0.14)',
      headerText: '#E9D5FF',
      headerAccent: '#A855F7',
      columnBg: 'rgba(168, 85, 247, 0.03)',
    },
  },
  emerald: {
    light: {
      groupHeaderBg: '#ECFDF5',
      groupHeaderText: '#065F46',
      groupHeaderBorder: '#D1FAE5',
      headerBg: '#F6FEF9',
      headerText: '#047857',
      headerAccent: '#10B981',
      columnBg: 'rgba(16, 185, 129, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(6, 95, 70, 0.24)',
      groupHeaderText: '#6EE7B7',
      groupHeaderBorder: 'rgba(16, 185, 129, 0.30)',
      headerBg: 'rgba(6, 78, 59, 0.15)',
      headerText: '#A7F3D0',
      headerAccent: '#10B981',
      columnBg: 'rgba(16, 185, 129, 0.03)',
    },
  },
  green: {
    light: {
      groupHeaderBg: '#F0FDF4',
      groupHeaderText: '#166534',
      groupHeaderBorder: '#DCFCE7',
      headerBg: '#F7FEF9',
      headerText: '#15803D',
      headerAccent: '#22C55E',
      columnBg: 'rgba(34, 197, 94, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(22, 101, 52, 0.24)',
      groupHeaderText: '#86EFAC',
      groupHeaderBorder: 'rgba(34, 197, 94, 0.30)',
      headerBg: 'rgba(20, 83, 45, 0.15)',
      headerText: '#BBF7D0',
      headerAccent: '#22C55E',
      columnBg: 'rgba(34, 197, 94, 0.03)',
    },
  },
  teal: {
    light: {
      groupHeaderBg: '#F0FDFA',
      groupHeaderText: '#115E59',
      groupHeaderBorder: '#CCFBF1',
      headerBg: '#F7FEFC',
      headerText: '#0F766E',
      headerAccent: '#14B8A6',
      columnBg: 'rgba(20, 184, 166, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(17, 94, 89, 0.24)',
      groupHeaderText: '#5EEAD4',
      groupHeaderBorder: 'rgba(20, 184, 166, 0.30)',
      headerBg: 'rgba(19, 78, 74, 0.15)',
      headerText: '#99F6E4',
      headerAccent: '#14B8A6',
      columnBg: 'rgba(20, 184, 166, 0.03)',
    },
  },
  cyan: {
    light: {
      groupHeaderBg: '#ECFEFF',
      groupHeaderText: '#155E75',
      groupHeaderBorder: '#CFFAFE',
      headerBg: '#F6FEFF',
      headerText: '#0E7490',
      headerAccent: '#06B6D4',
      columnBg: 'rgba(6, 182, 212, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(21, 94, 117, 0.24)',
      groupHeaderText: '#67E8F9',
      groupHeaderBorder: 'rgba(6, 182, 212, 0.30)',
      headerBg: 'rgba(22, 78, 99, 0.15)',
      headerText: '#A5F3FC',
      headerAccent: '#06B6D4',
      columnBg: 'rgba(6, 182, 212, 0.03)',
    },
  },
  amber: {
    light: {
      groupHeaderBg: '#FFFBEB',
      groupHeaderText: '#92400E',
      groupHeaderBorder: '#FEF3C7',
      headerBg: '#FFFDF5',
      headerText: '#B45309',
      headerAccent: '#F59E0B',
      columnBg: 'rgba(245, 158, 11, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(146, 64, 14, 0.22)',
      groupHeaderText: '#FCD34D',
      groupHeaderBorder: 'rgba(245, 158, 11, 0.30)',
      headerBg: 'rgba(120, 53, 15, 0.14)',
      headerText: '#FDE68A',
      headerAccent: '#F59E0B',
      columnBg: 'rgba(245, 158, 11, 0.03)',
    },
  },
  orange: {
    light: {
      groupHeaderBg: '#FFF7ED',
      groupHeaderText: '#9A3412',
      groupHeaderBorder: '#FFEDD5',
      headerBg: '#FFFAF5',
      headerText: '#C2410C',
      headerAccent: '#F97316',
      columnBg: 'rgba(249, 115, 22, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(154, 52, 18, 0.22)',
      groupHeaderText: '#FDBA74',
      groupHeaderBorder: 'rgba(249, 115, 22, 0.30)',
      headerBg: 'rgba(124, 45, 18, 0.14)',
      headerText: '#FED7AA',
      headerAccent: '#F97316',
      columnBg: 'rgba(249, 115, 22, 0.03)',
    },
  },
  rose: {
    light: {
      groupHeaderBg: '#FFF1F2',
      groupHeaderText: '#9F1239',
      groupHeaderBorder: '#FFE4E6',
      headerBg: '#FFF8F9',
      headerText: '#BE123C',
      headerAccent: '#F43F5E',
      columnBg: 'rgba(244, 63, 94, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(159, 18, 57, 0.22)',
      groupHeaderText: '#FDA4AF',
      groupHeaderBorder: 'rgba(244, 63, 94, 0.30)',
      headerBg: 'rgba(136, 19, 55, 0.14)',
      headerText: '#FECDD3',
      headerAccent: '#F43F5E',
      columnBg: 'rgba(244, 63, 94, 0.03)',
    },
  },
  red: {
    light: {
      groupHeaderBg: '#FEF2F2',
      groupHeaderText: '#991B1B',
      groupHeaderBorder: '#FEE2E2',
      headerBg: '#FFF8F8',
      headerText: '#B91C1C',
      headerAccent: '#EF4444',
      columnBg: 'rgba(239, 68, 68, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(153, 27, 27, 0.22)',
      groupHeaderText: '#FCA5A5',
      groupHeaderBorder: 'rgba(239, 68, 68, 0.30)',
      headerBg: 'rgba(127, 29, 29, 0.14)',
      headerText: '#FECACA',
      headerAccent: '#EF4444',
      columnBg: 'rgba(239, 68, 68, 0.03)',
    },
  },
  slate: {
    light: {
      groupHeaderBg: '#F8FAFC',
      groupHeaderText: '#1E293B',
      groupHeaderBorder: '#E2E8F0',
      headerBg: '#FBFDFF',
      headerText: '#334155',
      headerAccent: '#64748B',
      columnBg: 'rgba(100, 116, 139, 0.015)',
    },
    dark: {
      groupHeaderBg: 'rgba(51, 65, 85, 0.28)',
      groupHeaderText: '#CBD5E1',
      groupHeaderBorder: 'rgba(148, 163, 184, 0.25)',
      headerBg: 'rgba(30, 41, 59, 0.20)',
      headerText: '#E2E8F0',
      headerAccent: '#94A3B8',
      columnBg: 'rgba(148, 163, 184, 0.025)',
    },
  },
};

function parseHexRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export class ColumnColorEngine {
  public static isPreset(val: any): val is ColumnColorPreset {
    return typeof val === 'string' && val in COLUMN_COLOR_PALETTES;
  }

  public static getPresetTokens(preset: ColumnColorPreset, isDark: boolean): ResolvedPaletteTokens {
    const entry = COLUMN_COLOR_PALETTES[preset] || COLUMN_COLOR_PALETTES.blue;
    return isDark ? entry.dark : entry.light;
  }

  /**
   * Resolves a ThemeAwareColor for a specific role ('groupHeaderBg' | 'groupHeaderText' | 'headerBg' | 'headerText' | 'headerAccent' | 'columnBg' | 'columnText' | 'raw')
   */
  public static resolveColorValue(
    input: ThemeAwareColor | undefined,
    isDark: boolean,
    role:
      | 'groupHeaderBg'
      | 'groupHeaderText'
      | 'groupHeaderBorder'
      | 'headerBg'
      | 'headerText'
      | 'headerAccent'
      | 'columnBg'
      | 'columnText'
      | 'raw' = 'raw'
  ): string | undefined {
    if (!input) return undefined;

    // 1. Explicit { light, dark } pair
    if (typeof input === 'object' && ('light' in input || 'dark' in input)) {
      const picked = isDark ? input.dark || input.light : input.light || input.dark;
      if (!picked) return undefined;
      if (this.isPreset(picked)) {
        const tokens = this.getPresetTokens(picked, isDark);
        return role === 'raw' ? tokens.headerAccent : tokens[role] || tokens.headerAccent;
      }
      return picked;
    }

    if (typeof input !== 'string') return undefined;
    const str = input.trim();
    if (!str) return undefined;

    // 2. Named semantic preset ('emerald', 'blue', 'amber', etc.)
    if (this.isPreset(str)) {
      const tokens = this.getPresetTokens(str, isDark);
      return role === 'raw' ? tokens.headerAccent : tokens[role] || tokens.headerAccent;
    }

    // 3. Single hex color string -> auto-adapt for Dark / Light surface roles if used as background shorthand
    const rgb = parseHexRgb(str);
    if (rgb) {
      // Lift dark hex colors (e.g. #1e3a8a, #065f46, #7c2d12) to bright vibrant hues before mixing with white
      const maxC = Math.max(rgb.r, rgb.g, rgb.b, 1);
      const scale = maxC < 215 ? 215 / maxC : 1;
      const liftedR = Math.min(255, Math.round(rgb.r * scale));
      const liftedG = Math.min(255, Math.round(rgb.g * scale));
      const liftedB = Math.min(255, Math.round(rgb.b * scale));

      // Blend with pure white in light mode so canvas fillRect replaces dark/grey base headerBg with a bright, airy pastel
      const mixWhite = (alpha: number) => {
        const r = Math.round(255 * (1 - alpha) + liftedR * alpha);
        const g = Math.round(255 * (1 - alpha) + liftedG * alpha);
        const b = Math.round(255 * (1 - alpha) + liftedB * alpha);
        return `rgb(${r}, ${g}, ${b})`;
      };
      if (role === 'groupHeaderBg') {
        return isDark
          ? `rgba(${liftedR}, ${liftedG}, ${liftedB}, 0.16)`
          : mixWhite(0.055);
      }
      if (role === 'headerBg') {
        return isDark
          ? `rgba(${liftedR}, ${liftedG}, ${liftedB}, 0.09)`
          : mixWhite(0.025);
      }
      if (role === 'columnBg') {
        return isDark
          ? `rgba(${liftedR}, ${liftedG}, ${liftedB}, 0.02)`
          : `rgba(${liftedR}, ${liftedG}, ${liftedB}, 0.008)`;
      }
      if (role === 'groupHeaderBorder') {
        return isDark
          ? `rgba(${liftedR}, ${liftedG}, ${liftedB}, 0.28)`
          : mixWhite(0.12);
      }
    }

    return str;
  }

  public static resolveGroupStyle(
    group: ColumnGroupDef | undefined,
    isDark: boolean
  ): ResolvedGroupHeaderStyle {
    if (!group) return {};
    const baseColor = group.style?.preset || group.color;
    const style: ColumnColorConfig | undefined = group.style;

    const groupHeaderBg =
      this.resolveColorValue(style?.groupHeaderBg, isDark, 'groupHeaderBg') ||
      this.resolveColorValue(style?.headerBg, isDark, 'groupHeaderBg') ||
      this.resolveColorValue(group.headerColor, isDark, 'groupHeaderBg') ||
      this.resolveColorValue(baseColor, isDark, 'groupHeaderBg');

    const groupHeaderText =
      this.resolveColorValue(style?.groupHeaderText, isDark, 'groupHeaderText') ||
      this.resolveColorValue(style?.headerText, isDark, 'groupHeaderText') ||
      this.resolveColorValue(group.headerTextColor, isDark, 'groupHeaderText') ||
      (baseColor && this.isPreset(baseColor)
        ? this.getPresetTokens(baseColor, isDark).groupHeaderText
        : undefined);

    const groupHeaderBorder =
      this.resolveColorValue(style?.borderColor, isDark, 'groupHeaderBorder') ||
      this.resolveColorValue(baseColor, isDark, 'groupHeaderBorder');

    const accentColor =
      this.resolveColorValue(style?.headerAccent, isDark, 'headerAccent') ||
      this.resolveColorValue(baseColor, isDark, 'headerAccent') ||
      this.resolveColorValue(group.headerColor, isDark, 'headerAccent');

    return {
      headerBg: groupHeaderBg,
      headerText: groupHeaderText,
      headerAccent: accentColor,
      borderColor: groupHeaderBorder,
      groupHeaderBg,
      groupHeaderText,
      groupHeaderBorder,
      accentColor,
    };
  }

  public static resolveColumnStyle(
    col: ColumnDef,
    group: ColumnGroupDef | undefined,
    isDark: boolean
  ): ResolvedColumnStyle {
    const inheritGroup = group && group.inheritColumnColors !== false;
    const groupBaseColor = inheritGroup ? group.style?.preset || group.color : undefined;
    const colBaseColor = col.style?.preset || col.color;
    const effectiveBase = colBaseColor || groupBaseColor;

    // 1. Header Background
    const headerBg =
      this.resolveColorValue(col.style?.headerBg, isDark, 'headerBg') ||
      this.resolveColorValue(col.headerColor, isDark, 'headerBg') ||
      this.resolveColorValue(colBaseColor, isDark, 'headerBg') ||
      (inheritGroup
        ? this.resolveColorValue(group.style?.headerBg, isDark, 'headerBg') ||
          this.resolveColorValue(group.headerColor, isDark, 'headerBg') ||
          this.resolveColorValue(groupBaseColor, isDark, 'headerBg')
        : undefined);

    // 2. Header Text
    const headerText =
      this.resolveColorValue(col.style?.headerText, isDark, 'headerText') ||
      this.resolveColorValue(col.headerTextColor, isDark, 'headerText') ||
      (colBaseColor && this.isPreset(colBaseColor)
        ? this.getPresetTokens(colBaseColor, isDark).headerText
        : undefined) ||
      (inheritGroup
        ? this.resolveColorValue(group.style?.headerText, isDark, 'headerText') ||
          (groupBaseColor && this.isPreset(groupBaseColor)
            ? this.getPresetTokens(groupBaseColor, isDark).headerText
            : undefined)
        : undefined);

    // 3. Header Accent Line
    const headerAccent =
      this.resolveColorValue(col.style?.headerAccent, isDark, 'headerAccent') ||
      this.resolveColorValue(colBaseColor, isDark, 'headerAccent') ||
      this.resolveColorValue(col.headerColor, isDark, 'headerAccent') ||
      (inheritGroup
        ? this.resolveColorValue(group.style?.headerAccent, isDark, 'headerAccent') ||
          this.resolveColorValue(groupBaseColor, isDark, 'headerAccent')
        : undefined);

    // 4. Column Cell Background Tint
    const columnBg =
      this.resolveColorValue(col.style?.columnBg, isDark, 'columnBg') ||
      this.resolveColorValue(col.columnColor, isDark, 'columnBg') ||
      this.resolveColorValue(colBaseColor, isDark, 'columnBg') ||
      (inheritGroup
        ? this.resolveColorValue(group.style?.columnBg, isDark, 'columnBg') ||
          this.resolveColorValue(group.columnColor, isDark, 'columnBg') ||
          this.resolveColorValue(groupBaseColor, isDark, 'columnBg')
        : undefined);

    // 5. Column Cell Text Color
    const columnText =
      this.resolveColorValue(col.style?.columnText, isDark, 'columnText') ||
      this.resolveColorValue(col.columnTextColor, isDark, 'columnText') ||
      (inheritGroup
        ? this.resolveColorValue(group.style?.columnText, isDark, 'columnText')
        : undefined) ||
      (effectiveBase && this.isPreset(effectiveBase)
        ? this.getPresetTokens(effectiveBase, isDark).columnText
        : undefined);

    // 6. Optional Column Header Border Color
    const borderColor =
      this.resolveColorValue(col.style?.borderColor, isDark, 'groupHeaderBorder') ||
      (inheritGroup
        ? this.resolveColorValue(group.style?.borderColor, isDark, 'groupHeaderBorder')
        : undefined);

    return {
      headerBg,
      headerText,
      headerAccent,
      columnBg,
      columnText,
      borderColor,
    };
  }
}
