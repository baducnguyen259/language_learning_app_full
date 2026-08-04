import 'package:flutter/material.dart';
import 'package:language_learning_app/app/common/values/values.dart';

/// Cấu hình giao diện Material 3 dùng chung cho toàn bộ ứng dụng.
///
/// Theme được tách khỏi widget gốc để các module MVVM có thể dùng chung một
/// nguồn cấu hình. Màu sắc thích ứng theo [ColorScheme], còn font và kiểu chữ
/// được chuẩn hóa bằng [AppTextStyle.fontFamily].
abstract final class AppTheme {
  AppTheme._();

  /// Theme sáng của ứng dụng.
  // Cache the theme so rebuilds do not recreate the full ThemeData tree.
  static final ThemeData light = _buildTheme(Brightness.light);

  /// Theme tối của ứng dụng.
  static final ThemeData dark = _buildTheme(Brightness.dark);

  static ThemeData _buildTheme(Brightness brightness) {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.seedColor,
      brightness: brightness,
    );
    final textTheme = _textTheme(colorScheme);

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      fontFamily: AppTextStyle.fontFamily,
      textTheme: textTheme,
      inputDecorationTheme: _inputDecorationTheme(colorScheme, textTheme),
      elevatedButtonTheme: _elevatedButtonTheme(colorScheme, textTheme),
      outlinedButtonTheme: _outlinedButtonTheme(colorScheme, textTheme),
      filledButtonTheme: _filledButtonTheme(colorScheme, textTheme),
      visualDensity: VisualDensity.standard,
    );
  }

  static TextTheme _textTheme(ColorScheme colorScheme) {
    final base = ThemeData(
      brightness: colorScheme.brightness,
      colorScheme: colorScheme,
      fontFamily: AppTextStyle.fontFamily,
      useMaterial3: true,
    ).textTheme;

    return base.copyWith(
      displayLarge: AppTextStyle.headingXLarge,
      displayMedium: AppTextStyle.headingLarge,
      displaySmall: AppTextStyle.headingMedium,
      headlineLarge: AppTextStyle.headingH1Bold,
      headlineMedium: AppTextStyle.headingH2Bold,
      headlineSmall: AppTextStyle.headingSmall,
      titleLarge: AppTextStyle.headingMedium,
      titleMedium: AppTextStyle.labelLarge,
      titleSmall: AppTextStyle.labelMedium,
      bodyLarge: AppTextStyle.paragraphLarge,
      bodyMedium: AppTextStyle.paragraphMedium,
      bodySmall: AppTextStyle.paragraphSmall,
      labelLarge: AppTextStyle.buttonL,
      labelMedium: AppTextStyle.labelMedium,
      labelSmall: AppTextStyle.labelXSmall,
    ).apply(
      fontFamily: AppTextStyle.fontFamily,
      bodyColor: colorScheme.onSurface,
      displayColor: colorScheme.onSurface,
    );
  }

  static InputDecorationTheme _inputDecorationTheme(
    ColorScheme colorScheme,
    TextTheme textTheme,
  ) {
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(color: colorScheme.outlineVariant),
    );
    final focusedBorder = OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(color: colorScheme.primary, width: 2),
    );

    return InputDecorationTheme(
      filled: true,
      fillColor: colorScheme.surfaceContainerHighest,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      labelStyle: textTheme.bodyMedium?.copyWith(
        color: colorScheme.onSurfaceVariant,
      ),
      hintStyle: textTheme.bodyMedium?.copyWith(
        color: colorScheme.onSurfaceVariant,
      ),
      errorStyle: textTheme.bodySmall?.copyWith(color: colorScheme.error),
      border: border,
      enabledBorder: border,
      focusedBorder: focusedBorder,
      errorBorder: border.copyWith(
        borderSide: BorderSide(color: colorScheme.error),
      ),
      focusedErrorBorder: focusedBorder.copyWith(
        borderSide: BorderSide(color: colorScheme.error, width: 2),
      ),
    );
  }

  static ElevatedButtonThemeData _elevatedButtonTheme(
    ColorScheme colorScheme,
    TextTheme textTheme,
  ) {
    return ElevatedButtonThemeData(
      style: _buttonStyle(
        foregroundColor: colorScheme.onPrimary,
        backgroundColor: colorScheme.primary,
        textTheme: textTheme,
      ),
    );
  }

  static OutlinedButtonThemeData _outlinedButtonTheme(
    ColorScheme colorScheme,
    TextTheme textTheme,
  ) {
    return OutlinedButtonThemeData(
      style: _buttonStyle(
        foregroundColor: colorScheme.primary,
        side: BorderSide(color: colorScheme.outline),
        textTheme: textTheme,
      ),
    );
  }

  static FilledButtonThemeData _filledButtonTheme(
    ColorScheme colorScheme,
    TextTheme textTheme,
  ) {
    return FilledButtonThemeData(
      style: _buttonStyle(
        foregroundColor: colorScheme.onPrimary,
        backgroundColor: colorScheme.primary,
        textTheme: textTheme,
      ),
    );
  }

  static ButtonStyle _buttonStyle({
    required Color foregroundColor,
    required TextTheme textTheme,
    Color? backgroundColor,
    BorderSide? side,
  }) {
    return ButtonStyle(
      minimumSize: const WidgetStatePropertyAll(Size.fromHeight(48)),
      padding: const WidgetStatePropertyAll(
        EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      foregroundColor: WidgetStatePropertyAll(foregroundColor),
      backgroundColor: backgroundColor == null
          ? null
          : WidgetStatePropertyAll(backgroundColor),
      side: side == null ? null : WidgetStatePropertyAll(side),
      textStyle: WidgetStatePropertyAll(textTheme.labelLarge),
    );
  }
}
