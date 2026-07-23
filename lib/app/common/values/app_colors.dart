part of 'values.dart';

/// Các token màu thương hiệu, ngữ nghĩa và màu cũ cố định.
///
/// Các giá trị này không thay đổi theo chế độ sáng hoặc tối. Ưu tiên dùng
/// [ColorScheme] Material 3 cho nền, văn bản và điều khiển theo theme; dùng [AppColors] cho
/// màu thương hiệu cố định hoặc khi thiết kế yêu cầu token chính xác.
///
/// ```dart
/// final scheme = Theme.of(context).colorScheme;
/// final adaptiveTextColor = scheme.onSurface;
/// final fixedBrandColor = AppColors.nvBrand500;
/// ```
abstract class AppColors {
  static const Color seedColor = Color(0xFFC8C4D7);

  /// Màu cũ.
  static const Color primaryColor = Color(0xFF625B71);
  static final Color primaryTextColor = Color(0xFF1E272E);
  static final Color tabActiveColor = Color(0xFFCE863A);
  static final Color tabInActiveColor = Color(0xFF000000);
  static final Color inputGrayColor = Color(0xFF707070);
  static final Color successColor = Color(0xFF28A745);
  static final Color errorColor = Color(0xFFF44336);
  static final Color backgroundColor = Color(0xFFF6F4F5);
  static final Color bgTextInputColor = Color(0xFFF6F5F4);
  static final Color colorStartAdvise = Color(0xFF08B5AA);
  static final Color colorTextService = Color(0xFF2C3137);
  static final Color colorTextAllService = Color(0xFF08B5AA);
  static final Color colorButtonNetHub = Color(0xFFE5141B);
  static final Color colorContentService = Color(0xFF737377);
  static final Color bgTeal = Color(0xFF23C9BF);
  static final Color bgGreen = Color(0xFF2CA94C);
  static final Color bgYellow = Color(0xFFD9BD2B);
  static final Color colorDot = Color(0xFFA0A1A2);
  static final Color accent = Color(0xFFFF353C);
  static final Color secondary = Color(0xFFF6F4F5);
  static final Color contentYellow = Color(0xFFFFDE32);
  static final Color borderInverseOpaque = Color(0xFF454A51);
  static final Color prettyDark = Color(0xFF070D14);
  static final Color tertiary = Color(0xFFEBEAEA);
  static final Color contentDisabled = Color(0xFFA0A1A2);
  static final Color red5 = Color(0xFFFFF5F5);
  static final Color teal = Color(0xFF23C9BF);
  static final Color bgRed = Color(0xFFFFF5F5);
  static final Color positive = Color(0xFF2CA94C);
  static final Color lightOrange = Color(0xFFFFF7F2);
  static final Color blueColor = Color(0xFF08B5AA);
  static final Color darkerAccent = Color(0xFFD92D33);
  static final Color opaque = HexColor('#EBEAEA');
  static final Color bgAvatar = HexColor('#EBEAEA');
  static final Color bgGreenBtn = HexColor('#F5FCF7');
  static final Color colorGreenBtn = HexColor('#64D481');
  static final Color colorBar = HexColor('#454A51');
  static final Color colorD3D2D2 = HexColor('#D3D2D2');
  static final Color color34C759 = HexColor('#34C759');
  static final Color lightBlue = HexColor('#007AFF');
  static final Color lightPinkRed = HexColor('#FFE9EA');
  static final Color bgNetbub = HexColor('#131A28');
  static final Color colorDeepGray = HexColor('#272B2F');
  static final Color bgSecondaryRed = HexColor('#FEE2E2');

  static final Color clickMe = HexColor('#10B9D0');
  static final Color clickMeDarker = HexColor('#0EA4B9');
  static final Color clickMeLighter = HexColor('#52D9EB');
  static final Color brightBlue = HexColor('#39D0E9');
  static final Color endangered = HexColor('#FF2F48');
  static final Color endangeredDarker = HexColor('#E31F37');
  static final Color endangeredLighter = HexColor('#FF566A');
  static final Color noticably = HexColor('#FFCD1C');
  static final Color noticeablyDarker = HexColor('#E6BA1B');
  static final Color noticeablyLighter = HexColor('#FFDA58');
  static final Color bgSIMBanner = HexColor('#283456');
  static final Color positiveDarker = HexColor('#08A84B');
  static final Color positiveLighter = HexColor('#37D579');
  static final Color prettyRed = HexColor('#FFEEEF');
  static final Color goldTips = HexColor('#E6BA1B');
  static final Color blueRibbon = HexColor('#0A65FF');
  static final Color athensGray = HexColor('#EBEBEC');
  static final Color blackOpacity02 = HexColor('#000000').withValues(alpha: .2);
  static final Color blackOpacity04 = HexColor('#000000').withValues(alpha: .4);
  static final Color pinkSalmon = HexColor('#FF8291');
  static final Color whiteOpacity = HexColor('#FFFFFF').withValues(alpha: .5);
  static final Color whiteOpacity92 = HexColor(
    '#FFFFFF',
  ).withValues(alpha: .92);
  static final Color scienceBlue = HexColor('#004EC7');
  static final Color borderGrey = HexColor('#D7D8D9');
  static final Color borderGreyScale = HexColor('#E3E3E3');
  static final Color lightGrayishBlue = HexColor('#E7EDFA');
  static final Color vividRed = HexColor('#ED1C24');
  static final Color lightGrayishCyan = HexColor('#F8F9F9');
  static final Color babyBlue = HexColor('#E6F9FC');

  // Khác
  static final Color pinkRed = HexColor('#ffeeef');
  static final Color fauxFloralWhite = HexColor('#FFF9F1');
  static final Color strawBurry = HexColor('#F84948');
  static final Color darkPurple = HexColor('#020234');

  // Nguyên thủy
  static final Color black100 = HexColor('#070D14');
  static final Color black90 = HexColor('#2C3137');
  static final Color black80 = HexColor('#454A51');
  static final Color black60 = HexColor('#737377');
  static final Color black40 = HexColor('#A0A1A2');
  static final Color black24 = HexColor('#242424');
  static final Color black20 = HexColor('#D3D2D2');
  static final Color black10 = HexColor('#EBEAEA');
  static final Color black5 = HexColor('#F6F4F5');
  static final Color white = HexColor('#FFFFFF');

  // Đỏ
  static final Color red100 = HexColor('#FF353C');
  static final Color red200 = HexColor('#FADBDC');
  static final Color red75 = HexColor('#FF676D');
  static final Color red35 = HexColor('#FFB8BB');
  static final Color red15 = HexColor('#FFE1E2');
  static final Color redDk65 = HexColor('#591315');
  static final Color redDk50 = HexColor('#801A1E');
  static final Color redDk35 = HexColor('#A62227');
  static final Color redDk15 = HexColor('#D92D33');
  static final Color red700 = HexColor('#B12B2E');
  static final Color red900 = HexColor('#5D1718');

  // Vàng
  static final Color yellow600 = HexColor('#F6BC2F');
  static final Color yellow100 = HexColor('#FFDE32');
  static final Color yellow75 = HexColor('#FFE665');
  static final Color yellow35 = HexColor('#FFF3B7');
  static final Color yellow15 = HexColor('#FFFAE0');
  static final Color yellow5 = HexColor('#FFFDF5');
  static final Color yellowDk65 = HexColor('#594E12');
  static final Color yellowDk50 = HexColor('#806F19');
  static final Color yellowDk35 = HexColor('#A69021');
  static final Color yellowDk15 = HexColor('#D9BD2B');

  // Xanh lá
  static final Color green100 = HexColor('#34C759');
  static final Color green75 = HexColor('#67D582');
  static final Color green35 = HexColor('#B8EBC5');
  static final Color green15 = HexColor('#E0F7E6');
  static final Color green5 = HexColor('#F5FCF7');
  static final Color greenDk65 = HexColor('#12461F');
  static final Color greenDk50 = HexColor('#1A632C');
  static final Color greenDk35 = HexColor('#22813A');
  static final Color greenDk15 = HexColor('#2CA94C');
  static final Color green158 = HexColor('#15803D');

  // Xanh dương
  static final Color blue100 = HexColor('#0A65FF');
  static final Color blue75 = HexColor('#478CFF');
  static final Color blue35 = HexColor('#A9C9FF');
  static final Color blue15 = HexColor('#DAE8FF');
  static final Color blue5 = HexColor('#F3F7FF');
  static final Color blueDk65 = HexColor('#042359');
  static final Color blueDk50 = HexColor('#053380');
  static final Color blueDk35 = HexColor('#0742A6');
  static final Color blueDk15 = HexColor('#0851CC');
  static final Color blue700 = HexColor('#1F59C2');
  static final Color blueBgBtn = HexColor('#266EF1');

  // Tím
  static final Color purple100 = HexColor('#6658F3');
  static final Color purple75 = HexColor('#8C82F6');
  static final Color purple35 = HexColor('#C9C5FB');
  static final Color purple15 = HexColor('#E8E6FD');
  static final Color purple5 = HexColor('#F7F7FE');
  static final Color purpleDk65 = HexColor('#281E43');
  static final Color purpleDk50 = HexColor('#332C79');
  static final Color purpleDk35 = HexColor('#42399E');
  static final Color purpleDk15 = HexColor('#574BCF');

  // Xanh ngọc
  static final Color teal100 = HexColor('#23C9BF');
  static final Color teal75 = HexColor('#5AD6CF');
  static final Color teal35 = HexColor('#B2ECE9');
  static final Color teal15 = HexColor('#DEF7F5');
  static final Color teal5 = HexColor('#F4FCFC');
  static final Color tealDk65 = HexColor('#0C4643');
  static final Color tealDk50 = HexColor('#116460');
  static final Color tealDk35 = HexColor('#17837C');
  static final Color tealDk15 = HexColor('#1EABA2');

  // Cam
  static final Color orange600 = HexColor('#FC823A');

  // Nền
  static final Color bgPrimary = HexColor('#FFFFFF');
  static final Color bgSecondary = HexColor('#F6F4F5');
  static final Color bgTertiary = HexColor('#EBEAEA');
  static final Color bgTertiary2 = HexColor('#EEEEEE');
  static final Color bgInversePrimary = HexColor('#000000');
  static final Color bgInverseSecondary = HexColor('#070D14');
  static final Color bgDisabled = HexColor('#F6F4F5');
  static final Color bgDisabledRed = HexColor('#FEF2F2');
  static final Color bgOverlayDark = HexColor('rgba(0, 0, 0, 0.3)');
  static final Color bgLight = HexColor('rgba(0, 0, 0, 0.08)');
  static final Color bgAccent = HexColor('#FF353C');
  static final Color bgDarkerAccent = HexColor('#D92D33');
  static final Color bgNegative = HexColor('#FF353C');
  static final Color bgWarning = HexColor('#FFDE32');
  static final Color bgPositive = HexColor('#34C759');
  static final Color bgPurple = HexColor('#F7F7FE');
  static final Color bgBlue = HexColor('#F3F7FF');
  static final Color bgBlack = HexColor('#000000');
  static final Color bgWhite = HexColor('#FFFFFF');
  static final Color bgOrange = HexColor('#FFEDD5');
  static final Color bgGreen2 = HexColor('#F0FDF4');
  static final Color bgGray = HexColor('#f4f4f4');

  // Viền
  static final Color borderActive = HexColor('#7C7C7C');

  // Bán kính
  static final Color raidusGreen = HexColor('#34c759');

  // Nội dung
  static final Color contentLarge = HexColor('#070D14');
  static final Color contentInversePrimary = HexColor('#FFFFFF');
  static final Color contentInverseSecondary = HexColor(
    'rgba(255, 255, 255, 0.8)',
  );
  static final Color contentInverseTertiary = HexColor(
    'rgba(255, 255, 255, 0.6)',
  );
  static final Color contentOnColor = HexColor('#FFFFFF');
  static final Color contentAccent = HexColor('#FF353C');
  static final Color contentNegative = HexColor('#FF353C');
  static final Color contentWarning = HexColor('#D9BD2B');
  static final Color contentPositive = HexColor('#2CA94C');
  static final Color contentPurple = HexColor('#6658F3');
  static final Color contentBlue = HexColor('#0A65FF');
  static final Color contentTeal = HexColor('#1EABA2');
  static final Color contentGreen = HexColor('#34C759');
  static final Color colorAlabaster = HexColor('#FBFBFB');
  static final Color contentRed = HexColor('#EF4444');
  static final Color contentDark = HexColor('#565656');
  static final Color contentDark1 = HexColor('#898989');
  static final Color colorOrangePlus = HexColor('#C2410C');
  static final Color contentYellow2 = HexColor('#A16207');
  static final Color contentGreen2 = HexColor('#15803D');
  static final Color contentRed2 = HexColor('#B91C1C');
  static final Color contentBlack = HexColor('#242424');

  /// Nội dung - Chính
  static final Color contentPrimaryLight = HexColor('#FFFFFF');
  static final Color contentPrimaryLightP = HexColor('#FAF9FC');
  static final Color contentPrimaryLightPP = HexColor('#F4F2F7');
  static final Color contentPrimaryDark = HexColor('#1B1A1E');
  static final Color contentPrimaryDarkP = HexColor('#45434A');
  static final Color contentPrimaryDarkPP = HexColor('#5E5B63');
  static final Color contentPrimaryDarkPPP = HexColor('#77747C');
  static final Color contentPrimaryBlack = HexColor('#000000');

  /// Nội dung - Phụ
  static final Color contentSecondaryBlue = HexColor('#2563EB');
  static final Color contentSecondaryBlueP = HexColor('#1D4ED8');
  static final Color contentSecondaryOrange = HexColor('#EA580C');
  static final Color contentSecondaryOrangeP = HexColor('#C2410C');
  static final Color contentSecondaryGreen = HexColor('#16A34A');
  static final Color contentSecondaryGreenP = HexColor('#15803D');
  static final Color contentSecondaryRed = HexColor('#E11D48');
  static final Color contentSecondaryRedP = HexColor('#BE123C');
  static final Color contentSecondaryCyan = HexColor('#0891B2');
  static final Color contentSecondaryCyanP = HexColor('#0E7490');
  static final Color contentSecondaryYellow = HexColor('#CA8A04');
  static final Color contentSecondaryYellowP = HexColor('#A16207');
  static final Color contentSecondaryTeal = HexColor('#0D9488');
  static final Color contentSecondaryTealP = HexColor('#0F766E');
  static final Color contentSecondaryPurple = HexColor('#625B71');
  static final Color contentSecondaryPurpleP = HexColor('#46414F');

  /// Nội dung - Vô hiệu hóa
  static final Color contentDisableGrayScale = HexColor('#BEBBC3');
  static final Color contentDisableBlue = HexColor('#BFDBFE');
  static final Color contentDisableOrange = HexColor('#FED7AA');
  static final Color contentDisableGreen = HexColor('#BBF7D0');
  static final Color contentDisableRed = HexColor('#FECDD3');
  static final Color contentDisableCyan = HexColor('#A5F3FC');
  static final Color contentDisableYellow = HexColor('#FEF08A');
  static final Color contentDisableTeal = HexColor('#99F6E4');
  static final Color contentDisablePurple = HexColor('#DCD8E5');

  /// Nền - Chính
  static final Color backgroundPrimaryLight = HexColor('#FFFFFF');
  static final Color backgroundPrimaryLightP = HexColor('#FAF9FC');
  static final Color backgroundPrimaryLightPP = HexColor('#F4F2F7');

  /// Nền - Lớp phủ
  static final Color backgroundScrim = const Color(0x52000000);
  static final Color backgroundScrimP = const Color(0x99000000);

  /// Nền - Phụ - Sáng
  static final Color backgroundSecondaryLightBlue = HexColor('#EFF6FF');
  static final Color backgroundSecondaryLightOrange = HexColor('#FFF7ED');
  static final Color backgroundSecondaryLightGreen = HexColor('#F0FDF4');
  static final Color backgroundSecondaryLightRed = HexColor('#FFF1F2');
  static final Color backgroundSecondaryLightCyan = HexColor('#ECFEFF');
  static final Color backgroundSecondaryLightYellow = HexColor('#FEFCE8');
  static final Color backgroundSecondaryLightTeal = HexColor('#F0FDFA');
  static final Color backgroundSecondaryLightPurple = HexColor('#F9F8FC');

  /// Nền - Phụ - Tối
  static final Color backgroundSecondaryDarkBlue = HexColor('#1D4ED8');
  static final Color backgroundSecondaryDarkOrange = HexColor('#C2410C');
  static final Color backgroundSecondaryDarkGreen = HexColor('#15803D');
  static final Color backgroundSecondaryDarkRedP = HexColor('#BE123C');
  static final Color backgroundSecondaryDarkRedPP = HexColor('#881337');
  static final Color backgroundSecondaryDarkCyan = HexColor('#0E7490');
  static final Color backgroundSecondaryDarkYellow = HexColor('#A16207');
  static final Color backgroundSecondaryDarkTeal = HexColor('#0F766E');
  static final Color backgroundSecondaryDarkPurple = HexColor('#46414F');

  /// Nền - Vô hiệu hóa - Chính
  static final Color backgroundDisablePrimaryGrayScale = HexColor('#F4F2F7');

  /// Nền - Vô hiệu hóa - Phụ
  static final Color backgroundDisableSecondaryBlue = HexColor('#DBEAFE');
  static final Color backgroundDisableSecondaryOrange = HexColor('#FFEDD5');
  static final Color backgroundDisableSecondaryGreen = HexColor('#DCFCE7');
  static final Color backgroundDisableSecondaryRed = HexColor('#FFE4E6');
  static final Color backgroundDisableSecondaryCyan = HexColor('#CFFAFE');
  static final Color backgroundDisableSecondaryYellow = HexColor('#FEF9C3');
  static final Color backgroundDisableSecondaryTeal = HexColor('#CCFBF1');
  static final Color backgroundDisableSecondaryPurple = HexColor('#F2F0F7');

  /// Viền - Chính - Đậm
  static final Color borderPrimaryBoldGrayScaleP = HexColor('#9D99A2');

  /// Viền - Chính - Nhạt
  static final Color borderPrimaryLightGrayScale = HexColor('#E9E7ED');

  /// Viền - Phụ - Đậm
  static final Color borderSecondaryBoldBlueP = HexColor('#1D4ED8');
  static final Color borderSecondaryBoldOrangeP = HexColor('#C2410C');
  static final Color borderSecondaryBoldGreenP = HexColor('#15803D');
  static final Color borderSecondaryBoldRedP = HexColor('#BE123C');
  static final Color borderSecondaryBoldCyanP = HexColor('#0E7490');
  static final Color borderSecondaryBoldYellowP = HexColor('#A16207');
  static final Color borderSecondaryBoldTealP = HexColor('#0F766E');
  static final Color borderSecondaryBoldPurpleP = HexColor('#46414F');

  /// Viền - Phụ - Nhạt
  static final Color borderSecondaryLightBlue = HexColor('#BFDBFE');
  static final Color borderSecondaryLightOrange = HexColor('#FED7AA');
  static final Color borderSecondaryLightGreen = HexColor('#BBF7D0');
  static final Color borderSecondaryLightRed = HexColor('#FECDD3');
  static final Color borderSecondaryLightCyan = HexColor('#A5F3FC');
  static final Color borderSecondaryLightYellow = HexColor('#FEF08A');
  static final Color borderSecondaryLightTeal = HexColor('#99F6E4');
  static final Color borderSecondaryLightPurple = HexColor('#DCD8E5');

  /// Viền - Vô hiệu hóa - Chính
  static final Color borderDisablePrimaryGrayScale = HexColor('#E9E7ED');

  /// Viền - Vô hiệu hóa - Phụ
  static final Color borderDisableSecondaryBlue = HexColor('#DBEAFE');
  static final Color borderDisableSecondaryOrange = HexColor('#FFEDD5');
  static final Color borderDisableSecondaryGreen = HexColor('#DCFCE7');
  static final Color borderDisableSecondaryRed = HexColor('#FFE4E6');
  static final Color borderDisableSecondaryCyan = HexColor('#CFFAFE');
  static final Color borderDisableSecondaryYellow = HexColor('#FEF9C3');

  /// Độ nổi
  static final Color elevationS1 = const Color(0x0F000000);
  static final Color elevationS2 = const Color(0x1F000000);

  /// Nền
  static final Color colorBackgroundPrimary = HexColor('#FFFFFF');
  static final Color colorBackgroundScrim = const Color(0x52000000);

  /// Nét viền
  static final Color colorStokePrimary = HexColor('#E9E7ED');

  /// Trung tính
  static final Color colorNeutralN01 = HexColor('#FFFFFF');
  static final Color colorNeutralN02 = HexColor('#F4F2F7');
  static final Color colorNeutralN03 = HexColor('#E9E7ED');
  static final Color colorNeutralN04 = HexColor('#DAD8DE');
  static final Color colorNeutralN05 = HexColor('#BEBBC3');
  static final Color colorNeutralN06 = HexColor('#9D99A2');
  static final Color colorNeutralN07 = HexColor('#77747C');
  static final Color colorNeutralN08 = HexColor('#5E5B63');
  static final Color colorNeutralN09 = HexColor('#45434A');
  static final Color colorNeutralN10 = HexColor('#302E34');
  static final Color colorNeutralN11 = HexColor('#1B1A1E');

  /// Màu nhấn
  static final Color colorAccentRed01 = HexColor('#FFF1F2');
  static final Color colorAccentRed02 = HexColor('#FFE4E6');
  static final Color colorAccentRed03 = HexColor('#FECDD3');
  static final Color colorAccentRed04 = HexColor('#FDA4AF');
  static final Color colorAccentRed05 = HexColor('#FB7185');
  static final Color colorAccentRed06 = HexColor('#F43F5E');
  static final Color colorAccentRed07 = HexColor('#E11D48');
  static final Color colorAccentRed08 = HexColor('#BE123C');
  static final Color colorAccentRed09 = HexColor('#881337');

  static final Color colorAccentOrange01 = HexColor('#FFF7ED');
  static final Color colorAccentOrange02 = HexColor('#FFEDD5');
  static final Color colorAccentOrange03 = HexColor('#FED7AA');
  static final Color colorAccentOrange04 = HexColor('#FDBA74');
  static final Color colorAccentOrange05 = HexColor('#FB923C');
  static final Color colorAccentOrange06 = HexColor('#F97316');
  static final Color colorAccentOrange07 = HexColor('#EA580C');
  static final Color colorAccentOrange08 = HexColor('#C2410C');
  static final Color colorAccentOrange09 = HexColor('#7C2D12');

  static final Color colorAccentYellow01 = HexColor('#FEFCE8');
  static final Color colorAccentYellow02 = HexColor('#FEF9C3');
  static final Color colorAccentYellow03 = HexColor('#FEF08A');
  static final Color colorAccentYellow04 = HexColor('#FDE047');
  static final Color colorAccentYellow05 = HexColor('#FACC15');
  static final Color colorAccentYellow06 = HexColor('#EAB308');
  static final Color colorAccentYellow07 = HexColor('#CA8A04');
  static final Color colorAccentYellow08 = HexColor('#A16207');
  static final Color colorAccentYellow09 = HexColor('#713F12');

  static final Color colorAccentGreen01 = HexColor('#F0FDF4');
  static final Color colorAccentGreen02 = HexColor('#DCFCE7');
  static final Color colorAccentGreen03 = HexColor('#BBF7D0');
  static final Color colorAccentGreen04 = HexColor('#86EFAC');
  static final Color colorAccentGreen05 = HexColor('#4ADE80');
  static final Color colorAccentGreen06 = HexColor('#22C55E');
  static final Color colorAccentGreen07 = HexColor('#16A34A');
  static final Color colorAccentGreen08 = HexColor('#15803D');
  static final Color colorAccentGreen09 = HexColor('#14532D');

  static final Color colorAccentBlue01 = HexColor('#EFF6FF');
  static final Color colorAccentBlue02 = HexColor('#DBEAFE');
  static final Color colorAccentBlue03 = HexColor('#BFDBFE');
  static final Color colorAccentBlue04 = HexColor('#93C5FD');
  static final Color colorAccentBlue05 = HexColor('#60A5FA');
  static final Color colorAccentBlue06 = HexColor('#3B82F6');
  static final Color colorAccentBlue07 = HexColor('#2563EB');
  static final Color colorAccentBlue08 = HexColor('#1D4ED8');
  static final Color colorAccentBlue09 = HexColor('#1E3A8A');

  /// Văn bản
  static final Color colorTextT01 = HexColor('#1B1A1E');
  static final Color colorTextT02 = HexColor('#5E5B63');
  static final Color colorTextT03 = HexColor('#9D99A2');
  static final Color colorTextT04 = HexColor('#BEBBC3');

  /// Phiên bản 3
  static final Color backgroundPrimary = HexColor('#FFFFFF');
  static final Color backgroundSecondary = HexColor('#FAF9FC');
  static final Color backgroundSecondaryInvert = HexColor('#302E34');
  static final Color backgroundTertiary = HexColor('#F4F2F7');

  static final Color borderOpaque = HexColor('#DAD8DE');
  static final Color borderOpaqueInvert = const Color(0x3DFFFFFF);
  static final Color borderSelectedInvert = HexColor('#D2CEDD');
  static final Color borderSelected = HexColor('#625B71');

  static final Color borderPPDisabled = HexColor('#DAD8DE');
  static final Color borderPPAccent = HexColor('#625B71');
  static final Color borderPPPositive = HexColor('#15803D');

  static final Color backgroundPPAccent = HexColor('#625B71');
  static final Color backgroundPPDisabled = HexColor('#E9E7ED');
  static final Color backgroundPPLightAccent = HexColor('#F2F0F7');
  static final Color backgroundPPLightPositive = HexColor('#F0FDF4');
  static final Color backgroundPPLightWarning = HexColor('#FEFCE8');
  static final Color backgroundPPWarning = HexColor('#CA8A04');
  static final Color backgroundPPLightInfo = HexColor('#EFF6FF');
  static final Color backgroundPPInfo = HexColor('#2563EB');
  static final Color backgroundPPPositive = HexColor('#16A34A');
  static final Color backgroundPrimaryInvert = HexColor('#1B1A1E');

  static final Color contentPPDisabled = HexColor('#BEBBC3');
  static final Color contentPPAccent = HexColor('#625B71');
  static final Color contentPPAccentInfo = HexColor('#1D4ED8');
  static final Color contentPPInfo = HexColor('#1D4ED8');
  static final Color contentPPOnColor = HexColor('#FFFFFF');
  static final Color contentPPWarning = HexColor('#A16207');
  static final Color contentPPOnColorInvert = HexColor('#1B1A1E');

  static final Color contentTertiary = HexColor('#9D99A2');
  static final Color contentTertiaryInvert = HexColor('#DAD8DE');
  static final Color contentSecondary = HexColor('#5E5B63');
  static final Color contentSecondaryInvert = HexColor('#F4F2F7');
  static final Color contentPrimary = HexColor('#1B1A1E');
  static final Color contentPrimaryInvert = HexColor('#FFFFFF');
  static final Color contentContentPPInfo = HexColor('#1D4ED8');
  static final Color contentPPPositive = HexColor('#15803D');
  static const Color colorChipBg = Color.fromRGBO(
    255,
    255,
    255,
    0.24,
  ); // waiting and error

  /// Phiên bản 4
  // Xám
  static final Color nvGray50 = HexColor('#FAF9FC');
  static final Color nvGray100 = HexColor('#F4F2F7');
  static final Color nvGray200 = HexColor('#E9E7ED');
  static final Color nvGray300 = HexColor('#DAD8DE');
  static final Color nvGray400 = HexColor('#BEBBC3');
  static final Color nvGray500 = HexColor('#9D99A2');
  static final Color nvGray600 = HexColor('#77747C');
  static final Color nvGray700 = HexColor('#5E5B63');
  static final Color nvGray800 = HexColor('#45434A');
  static final Color nvGray900 = HexColor('#302E34');
  static final Color nvGray950 = HexColor('#1B1A1E');
  // Màu thương hiệu
  static final Color nvBrand50 = HexColor('#F9F8FC');
  static final Color nvBrand100 = HexColor('#F2F0F7');
  static final Color nvBrand200 = HexColor('#E7E4EE');
  static final Color nvBrand300 = HexColor('#DCD8E5');
  static final Color nvBrand400 = HexColor('#D2CEDD');
  static final Color nvBrand500 = HexColor('#C8C4D7');
  static final Color nvBrand600 = HexColor('#A7A1B6');
  static final Color nvBrand700 = HexColor('#827A92');
  static final Color nvBrand800 = HexColor('#625B71');
  static final Color nvBrand900 = HexColor('#46414F');
  static final Color nvBrand950 = HexColor('#29262E');
  // Màu chuyển sắc
  static final Color nvGradientFrom = HexColor('#C8C4D7');
  static final Color nvGradientTo = HexColor('#625B71');
}

/// Một [Color] được phân tích từ chuỗi thập lục phân, `rgb()` hoặc `rgba()`.
///
/// Các dạng thập lục phân được hỗ trợ là `#RGB`, `#ARGB`, `#RRGGBB` và
/// `#AARRGGBB` (kênh alpha đứng đầu). Tiền tố `0x` cũng được chấp nhận.
/// Màu CSS tám chữ số dùng `#RRGGBBAA`, vì vậy hãy chuyển kênh alpha
/// hãy đưa kênh alpha lên đầu trước khi truyền vào đây.
///
/// Các kênh `rgb()` phải là số nguyên từ 0 đến 255. Alpha của `rgba()`
/// Giá trị alpha phải là số thập phân từ 0 đến 1.
///
/// ```dart
/// final lavender = HexColor('#C8C4D7');
/// final halfLavender = HexColor('#80C8C4D7');
/// final overlay = HexColor('rgba(0, 0, 0, 0.3)');
/// final optionalColor = HexColor.tryParse(userInput);
/// ```
final class HexColor extends Color {
  /// Tạo màu từ [source].
  ///
  /// Ném [FormatException] khi [source] không thuộc các định dạng đã mô tả
  /// hoặc chứa kênh nằm ngoài phạm vi hợp lệ.
  HexColor(String source) : super(_parse(source));

  /// Phân tích [source], trả về `null` nếu đầu vào là `null` hoặc không hợp lệ.
  static HexColor? tryParse(String? source) {
    if (source == null) return null;
    try {
      return HexColor(source);
    } on FormatException {
      return null;
    }
  }

  static final RegExp _hexPattern = RegExp(
    r'^(?:#|0[xX])?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$',
  );
  static final RegExp _rgbPattern = RegExp(
    r'^(rgb|rgba)\s*\((.*)\)$',
    caseSensitive: false,
  );

  static int _parse(String source) {
    final input = source.trim();
    final hexMatch = _hexPattern.firstMatch(input);
    if (hexMatch != null) {
      final hex = hexMatch.group(1)!;
      final argb = switch (hex.length) {
        3 => 'FF${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}',
        4 =>
          '${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}',
        6 => 'FF$hex',
        8 => hex,
        _ => throw FormatException('Unsupported hex color.', source),
      };
      return int.parse(argb, radix: 16);
    }

    final rgbMatch = _rgbPattern.firstMatch(input);
    if (rgbMatch == null) {
      throw FormatException('Unsupported color format.', source);
    }

    final functionName = rgbMatch.group(1)!.toLowerCase();
    final parts = rgbMatch
        .group(2)!
        .split(',')
        .map((part) => part.trim())
        .toList();
    final expectedLength = functionName == 'rgba' ? 4 : 3;
    if (parts.length != expectedLength) {
      throw FormatException('Invalid $functionName color.', source);
    }

    int channel(String token) {
      final value = int.tryParse(token);
      if (value == null || value < 0 || value > 255) {
        throw FormatException('RGB channel must be between 0 and 255.', source);
      }
      return value;
    }

    final red = channel(parts[0]);
    final green = channel(parts[1]);
    final blue = channel(parts[2]);
    var alpha = 255;

    if (functionName == 'rgba') {
      final opacity = double.tryParse(parts[3]);
      if (opacity == null || !opacity.isFinite || opacity < 0 || opacity > 1) {
        throw FormatException('Alpha must be between 0 and 1.', source);
      }
      alpha = (opacity * 255).round();
    }

    return (alpha << 24) | (red << 16) | (green << 8) | blue;
  }
}
