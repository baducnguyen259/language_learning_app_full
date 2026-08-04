part of 'values.dart';

/// Các kiểu chữ dùng chung trong ứng dụng.
///
/// Tên các style được giữ nguyên để tương thích với Design System cũ,
/// đồng thời sử dụng font BeVietnamPro của ứng dụng.
///
/// Không thiết lập màu chữ tại đây để văn bản tự động kế thừa màu từ
/// giao diện Material 3 hiện tại (Light/Dark Theme).
///
/// Nếu cần hiển thị chính xác theo font SF hoặc Inter của thiết kế,
/// hãy cấu hình font trong Theme của ứng dụng.
///
/// Có thể tùy chỉnh từng style bằng `copyWith()` mà không làm thay đổi
/// giá trị gốc.
///
/// ```dart
/// Text(
///   'Bài học hôm nay',
///   style: AppTextStyle.headingSmall.copyWith(
///     color: Theme.of(context).colorScheme.onSurface,
///   ),
/// );
/// ```
abstract class AppTextStyle {
  /// Font chữ chuẩn được dùng cho toàn bộ style của ứng dụng.
  static const String fontFamily = 'BeVietnamPro';

  static TextStyle _style(
    double fontSize,
    FontWeight fontWeight,
    double height, [
    double? letterSpacing,
  ]) {
    return TextStyle(
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      height: height,
      letterSpacing: letterSpacing,
    );
  }

  // Kiểu chữ hiển thị cũ.
  static final TextStyle displayHeaderH1 = _style(
    20,
    FontWeight.w700,
    1.44,
    -0.22,
  );
  static final TextStyle displayHeaderH2 = _style(
    18,
    FontWeight.w700,
    1.44,
    -0.36,
  );

  static final TextStyle displayTitleT1 = _style(
    32,
    FontWeight.w700,
    1.30,
    -1.02,
  );
  static final TextStyle displayTitleT2 = _style(
    24,
    FontWeight.w700,
    1.40,
    -0.74,
  );
  static final TextStyle displayTitleT3 = _style(
    20,
    FontWeight.w700,
    1.50,
    -0.60,
  );

  // Giữ cách viết cũ `SubTile` để tương thích API.
  static final TextStyle displaySubTileST1 = _style(
    20,
    FontWeight.w500,
    1.48,
    -0.04,
  );
  static final TextStyle displaySubTileST2 = _style(
    18,
    FontWeight.w500,
    1.56,
    -0.12,
  );
  static final TextStyle displaySubTileST3 = _style(
    14,
    FontWeight.w500,
    1.60,
    -0.14,
  );

  static final TextStyle displayLabelL1Bold = _style(
    18,
    FontWeight.w700,
    1.56,
    -0.04,
  );
  static final TextStyle displayLabelL1Sem = _style(
    18,
    FontWeight.w600,
    1.56,
    -0.04,
  );
  static final TextStyle displayLabelL1Reg = _style(
    18,
    FontWeight.w400,
    1.56,
    -0.04,
  );

  static final TextStyle displayLabelL2Bold = _style(
    16,
    FontWeight.w700,
    1.50,
    -0.08,
  );
  static final TextStyle displayLabelL2Sem = _style(
    16,
    FontWeight.w600,
    1.50,
    -0.08,
  );
  static final TextStyle displayLabelL2Med = _style(
    16,
    FontWeight.w500,
    1.50,
    -0.08,
  );
  static final TextStyle displayLabelL2Reg = _style(
    16,
    FontWeight.w400,
    1.50,
    -0.08,
  );

  static final TextStyle displayLabelL3Bold = _style(
    14,
    FontWeight.w700,
    1.60,
    -0.10,
  );
  static final TextStyle displayLabelL3Sem = _style(
    14,
    FontWeight.w600,
    1.60,
    -0.10,
  );
  static final TextStyle displayLabelL3Reg = _style(
    14,
    FontWeight.w400,
    1.60,
    -0.10,
  );

  static final TextStyle displayButtonBU1 = _style(
    18,
    FontWeight.w600,
    1.56,
    -0.04,
  );
  static final TextStyle displayButtonBU2 = _style(
    16,
    FontWeight.w500,
    1.50,
    -0.16,
  );
  static final TextStyle displayButtonBU3 = _style(
    14,
    FontWeight.w500,
    1.44,
    -0.20,
  );

  static final TextStyle displayOverLineOL1 = _style(
    14,
    FontWeight.w700,
    1.72,
    -0.20,
  );
  static final TextStyle displayTextInputIN1 = _style(
    14,
    FontWeight.w400,
    1.60,
    -0.06,
  );

  // Kiểu chữ nội dung cũ.
  static final TextStyle textBodyBO1Sem = _style(
    18,
    FontWeight.w600,
    1.78,
    -0.60,
  );
  static final TextStyle textBodyBO1Reg = _style(
    18,
    FontWeight.w400,
    1.78,
    -0.60,
  );
  static final TextStyle textBodyBO2Sem = _style(
    16,
    FontWeight.w600,
    1.74,
    -0.40,
  );
  static final TextStyle textBodyBO2Reg = _style(
    16,
    FontWeight.w400,
    1.74,
    -0.40,
  );
  static final TextStyle textBodyBO3Sem = _style(
    14,
    FontWeight.w600,
    1.60,
    -0.20,
  );
  static final TextStyle textBodyBO3Reg = _style(
    14,
    FontWeight.w400,
    1.60,
    -0.20,
  );

  static final TextStyle textListLI1 = _style(18, FontWeight.w400, 1.56, -0.36);
  static final TextStyle textListLI2 = _style(16, FontWeight.w400, 1.52, -0.20);
  static final TextStyle textListLI3 = _style(14, FontWeight.w400, 1.50, -0.08);

  static final TextStyle textCaptionC1 = _style(12, FontWeight.w400, 1.50, 0);
  static final TextStyle textTextLinkTL1 = _style(
    18,
    FontWeight.w600,
    1.78,
    -0.60,
  );
  static final TextStyle textTextLinkTL2 = _style(
    16,
    FontWeight.w600,
    1.74,
    -0.40,
  );
  static final TextStyle textTextLinkTL3 = _style(
    14,
    FontWeight.w600,
    1.60,
    -0.20,
  );
  static final TextStyle textMessageM1 = _style(
    12,
    FontWeight.w500,
    1.50,
    -0.02,
  );

  // Kiểu chữ V2 - tiêu đề.
  static final TextStyle headingH1Semi = _style(40, FontWeight.w600, 1.20);
  static final TextStyle headingH1Bold = _style(40, FontWeight.w700, 1.20);
  static final TextStyle headingH2Semi = _style(36, FontWeight.w600, 1.20);
  static final TextStyle headingH2Bold = _style(36, FontWeight.w700, 1.20);
  static final TextStyle headingH3Semi = _style(32, FontWeight.w600, 1.20);
  static final TextStyle headingH3Bold = _style(32, FontWeight.w700, 1.20);
  static final TextStyle headingH4Semi = _style(28, FontWeight.w600, 1.20);
  static final TextStyle headingH4Bold = _style(28, FontWeight.w700, 1.20);
  static final TextStyle headingH5Semi = _style(24, FontWeight.w600, 1.20);
  static final TextStyle headingH5Bold = _style(24, FontWeight.w700, 1.20);
  static final TextStyle headingH6Semi = _style(20, FontWeight.w600, 1.20);
  static final TextStyle headingH6Bold = _style(20, FontWeight.w700, 1.20);
  static final TextStyle headingH7Semi = _style(18, FontWeight.w600, 1.20);
  static final TextStyle headingH7Bold = _style(18, FontWeight.w700, 1.20);

  // Kiểu chữ V2 - nội dung.
  static final TextStyle bodyLReg = _style(18, FontWeight.w400, 1.50);
  static final TextStyle bodyLMed = _style(18, FontWeight.w500, 1.50);
  static final TextStyle bodyLSemi = _style(18, FontWeight.w600, 1.50);
  static final TextStyle bodyLBold = _style(18, FontWeight.w700, 1.50);

  static final TextStyle bodyMReg = _style(16, FontWeight.w400, 1.50);
  static final TextStyle bodyMMed = _style(16, FontWeight.w500, 1.50);
  static final TextStyle bodyMSemi = _style(16, FontWeight.w600, 1.50);
  static final TextStyle bodyMBold = _style(16, FontWeight.w700, 1.50);

  static final TextStyle bodySReg = _style(14, FontWeight.w400, 1.50);
  static final TextStyle bodySMed = _style(14, FontWeight.w500, 1.50);
  static final TextStyle bodySSemi = _style(14, FontWeight.w600, 1.50);
  static final TextStyle bodySBold = _style(14, FontWeight.w700, 1.50);

  static final TextStyle bodyXSReg = _style(12, FontWeight.w400, 1.50);
  static final TextStyle bodyXSMed = _style(12, FontWeight.w500, 1.50);
  static final TextStyle bodyXSSemi = _style(12, FontWeight.w600, 1.50);
  static final TextStyle bodyXSBold = _style(12, FontWeight.w700, 1.50);

  // Kiểu chữ V2 - nút và liên kết đặc biệt.
  static final TextStyle buttonL = _style(16, FontWeight.w600, 1.50);
  static final TextStyle buttonS = _style(12, FontWeight.w600, 1.50);

  static final TextStyle specialTextLinkTL1 = _style(18, FontWeight.w600, 1.50);
  static final TextStyle specialTextLinkTL2 = _style(16, FontWeight.w600, 1.50);
  static final TextStyle specialTextLinkTL3 = _style(14, FontWeight.w600, 1.50);
  static final TextStyle specialTextLinkTL4 = _style(12, FontWeight.w600, 1.50);

  // Kiểu chữ V3 - nhãn.
  static final TextStyle labelMedium = _style(16, FontWeight.w600, 20 / 16);
  static final TextStyle labelMedSmall = _style(14, FontWeight.w500, 16 / 14);
  static final TextStyle labelMedXSmall = _style(12, FontWeight.w500, 16 / 12);
  static final TextStyle labelSmall = _style(14, FontWeight.w600, 16 / 14);
  static final TextStyle labelXSmall = _style(12, FontWeight.w600, 16 / 12);
  static final TextStyle labelLarge = _style(18, FontWeight.w600, 24 / 18);

  // Kiểu chữ V3 - đoạn văn.
  static final TextStyle paragraphSmall = _style(14, FontWeight.w400, 20 / 14);
  static final TextStyle paragraphXSmall = _style(12, FontWeight.w400, 20 / 12);
  static final TextStyle paragraphMedium = _style(16, FontWeight.w400, 24 / 16);
  static final TextStyle paragraphLarge = _style(18, FontWeight.w400, 28 / 18);

  // Kiểu chữ V3 - tiêu đề.
  static final TextStyle headingSmall = _style(24, FontWeight.w700, 32 / 24);
  static final TextStyle headingXSmall = _style(20, FontWeight.w700, 28 / 20);
  static final TextStyle headingMedium = _style(28, FontWeight.w700, 36 / 28);
  static final TextStyle headingXLarge = _style(36, FontWeight.w700, 44 / 36);
  static final TextStyle headingLarge = _style(32, FontWeight.w700, 40 / 32);

  static final TextStyle labelMedMedium = _style(16, FontWeight.w500, 20 / 16);
  static final TextStyle labelMedLarge = _style(18, FontWeight.w500, 24 / 18);
  static final TextStyle capXSmall = _style(12, FontWeight.w400, 20 / 12);
}
