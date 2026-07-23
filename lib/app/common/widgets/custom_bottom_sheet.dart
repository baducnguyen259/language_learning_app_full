import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/widgets/base_footer.dart';

/// Khung Material 3 dùng cho các bottom sheet của ứng dụng.
///
/// [onClose] chỉ được gọi khi nhấn nút đóng tích hợp sẵn. Để theo dõi mọi cách
/// đóng (vuốt, vùng nền, nút quay lại hệ thống hoặc nút đóng), hãy chờ
/// `Future` được trả về bởi `Get.bottomSheet` hoặc `BottomSheets.open`.
///
/// Ví dụ:
/// ```dart
/// Get.bottomSheet<void>(
///   const CustomBottomSheet(
///     title: 'Chọn ngôn ngữ',
///     child: Text('Nội dung'),
///   ),
///   isScrollControlled: true,
/// );
/// ```
class CustomBottomSheet extends StatelessWidget {
  /// Tạo khung bottom sheet với khu vực header và footer tùy chọn.
  const CustomBottomSheet({
    super.key,
    this.child = const SizedBox.shrink(),
    this.footer,
    this.leftActionButton,
    this.title = '',
    this.isExpanded = false,
    this.showFooterShadow = false,
    this.showHeaderShadow = false,
    this.showCloseButton = true,
    this.showHeader = true,
    this.showBar = false,
    this.isCloseBottomSheet = true,
    this.onClose,
  });

  static const BorderRadius _borderRadius = BorderRadius.only(
    topLeft: Radius.circular(16),
    topRight: Radius.circular(16),
  );

  final Widget child;
  final Widget? footer;
  final Widget? leftActionButton;
  final String title;
  final bool isExpanded;
  final bool showFooterShadow;
  final bool showHeaderShadow;
  final bool showCloseButton;
  final bool showHeader;
  final bool showBar;
  final bool isCloseBottomSheet;

  /// Được gọi sau khi nhấn nút đóng tích hợp sẵn.
  ///
  /// Callback này không được gọi khi đóng bằng vuốt, vùng nền hoặc nút quay lại hệ thống.
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final mediaQuery = MediaQuery.of(context);

    return Padding(
      padding: EdgeInsets.only(top: mediaQuery.viewPadding.top),
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: _borderRadius,
          boxShadow: showHeaderShadow
              ? [
                  BoxShadow(
                    color: colorScheme.shadow.withValues(alpha: 0.12),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: ClipRRect(
          borderRadius: _borderRadius,
          child: ColoredBox(
            color: colorScheme.surface,
            child: Column(
              mainAxisSize: isExpanded ? MainAxisSize.max : MainAxisSize.min,
              children: [
                if (showBar)
                  Container(
                    width: 48,
                    height: 4,
                    margin: const EdgeInsets.fromLTRB(0, 8, 0, 12),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                      color: colorScheme.onSurfaceVariant.withValues(
                        alpha: 0.4,
                      ),
                    ),
                  ),
                if (showHeader)
                  SizedBox(
                    height: 60,
                    child: Row(
                      children: [
                        SizedBox(
                          width: 60,
                          height: 60,
                          child: Center(child: leftActionButton),
                        ),
                        Expanded(
                          child: Text(
                            title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: theme.textTheme.titleMedium?.copyWith(
                              color: colorScheme.onSurface,
                              fontWeight: FontWeight.w600,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                        SizedBox(
                          width: 60,
                          height: 60,
                          child: showCloseButton
                              ? IconButton(
                                  tooltip: 'Đóng',
                                  onPressed: _close,
                                  icon: const Icon(Icons.close),
                                )
                              : null,
                        ),
                      ],
                    ),
                  ),
                Flexible(
                  fit: isExpanded ? FlexFit.tight : FlexFit.loose,
                  child: child,
                ),
                if (footer != null)
                  BaseFooter(showShadow: showFooterShadow, child: footer),
                SizedBox(height: mediaQuery.viewInsets.bottom),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _close() {
    if (isCloseBottomSheet) Get.back<void>();
    onClose?.call();
  }
}
