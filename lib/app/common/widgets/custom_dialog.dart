import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';

/// Điều khiển bố cục hành động được hiển thị bởi [CustomDialog].
/// [CONFIRM] và [ALERT] hiển thị hai hành động theo chiều ngang, [FORCE_ACTION] hiển thị một
/// hành động, còn các biến thể dọc sẽ xếp chồng các hành động. [INFO], [FOLDED] và
/// [NONE] là các bố cục cũ chỉ có nội dung.
///
enum DialogType {
  CONFIRM,
  FORCE_ACTION,
  ALERT,
  ALERT_VERTICAL,
  ALERT_VERTICAL_OUTLINE,
  INFO,
  FOLDED,
  NONE,
}

/// Nội dung dialog Material 3 được tiện ích route `Dialogs.open` sử dụng.
/// Ví dụ:
/// ```dart
/// Get.dialog(
///   CustomDialog(
///     dialogType: DialogType.CONFIRM,
///     title: 'Xác nhận',
///     content: const Text('Tiếp tục bài học?'),
///     primaryButtonLabel: 'Tiếp tục',
///     secondaryButtonLabel: 'Hủy',
///     primaryAction: saveProgress,
///   ),
/// );
/// ```
/// [canCloseDialog] chỉ điều khiển việc nút hành động có đóng route
/// trước khi callback chạy hay không. Nó không vô hiệu hóa biểu tượng đóng hoặc vùng nền.
/// [onClose] chỉ được gọi bởi biểu tượng đóng; hãy chờ Future của route để phản
/// ứng với mọi cơ chế đóng.
class CustomDialog extends StatelessWidget {
  const CustomDialog({
    super.key,
    required this.dialogType,
    this.imagePath = '',
    this.imageBackgroundHeaderPath = '',
    this.imageWidget,
    this.headerWidget,
    this.title = '',
    this.content = const SizedBox.shrink(),
    this.primaryButtonLabel = '',
    this.primaryButtonColor,
    this.secondaryButtonColor,
    this.secondaryButtonBackgroundColor,
    this.secondaryButtonLabel = '',
    this.primaryAction,
    this.secondaryAction,
    this.onClose,
    this.onHotline,
    this.hotlineLabel = 'Liên hệ hỗ trợ',
    this.showBtnLoading = false,
    this.showCloseButton = true,
    this.showHotline = false,
    this.barrierDismissible = false,
    this.insetPadding,
    this.imageHeight,
    this.canCloseDialog = true,
    this.imageColor,
    this.primaryButtonRadius,
  });

  final String imagePath;
  final String imageBackgroundHeaderPath;
  final Widget? imageWidget;
  final Widget? headerWidget;
  final String title;
  final Widget content;
  final String primaryButtonLabel;
  final Color? primaryButtonColor;
  final Color? secondaryButtonColor;
  final Color? secondaryButtonBackgroundColor;
  final Color? imageColor;
  final String secondaryButtonLabel;
  final DialogType dialogType;
  final FutureOr<void> Function()? primaryAction;
  final FutureOr<void> Function()? secondaryAction;
  final VoidCallback? onClose;
  final VoidCallback? onHotline;
  final String hotlineLabel;
  final bool showBtnLoading;
  final bool showCloseButton;
  final bool showHotline;

  /// Cần truyền cùng giá trị này cho `showDialog.barrierDismissible`.
  final bool barrierDismissible;

  final EdgeInsets? insetPadding;
  final double? imageHeight;
  final bool canCloseDialog;
  final double? primaryButtonRadius;

  bool get _hasHeaderImage =>
      headerWidget != null || imageBackgroundHeaderPath.isNotEmpty;

  bool get _hasActions => switch (dialogType) {
    DialogType.CONFIRM ||
    DialogType.FORCE_ACTION ||
    DialogType.ALERT ||
    DialogType.ALERT_VERTICAL ||
    DialogType.ALERT_VERTICAL_OUTLINE => true,
    DialogType.INFO || DialogType.FOLDED || DialogType.NONE => false,
  };

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final screenHeight = MediaQuery.sizeOf(context).height;

    return PopScope<Object?>(
      canPop: barrierDismissible,
      child: Dialog(
        insetPadding:
            insetPadding ?? const EdgeInsets.symmetric(horizontal: 24),
        backgroundColor: colorScheme.surface,
        surfaceTintColor: colorScheme.surfaceTint,
        clipBehavior: Clip.antiAlias,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxWidth: 560,
            maxHeight: screenHeight * 0.9,
          ),
          child: Stack(
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_hasHeaderImage) _buildHeaderImage(colorScheme),
                  Flexible(
                    fit: FlexFit.loose,
                    child: SingleChildScrollView(
                      padding: EdgeInsets.fromLTRB(
                        24,
                        !_hasHeaderImage && showCloseButton ? 56 : 24,
                        24,
                        _hasActions ? 0 : 24,
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (imageWidget != null || imagePath.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 24),
                              child:
                                  imageWidget ??
                                  _buildImage(
                                    imagePath,
                                    height: imageHeight,
                                    color: imageColor,
                                    fit: BoxFit.contain,
                                  ),
                            ),
                          if (title.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: Semantics(
                                header: true,
                                child: Text(
                                  title,
                                  style: theme.textTheme.headlineSmall
                                      ?.copyWith(
                                        color: colorScheme.onSurface,
                                        fontWeight: FontWeight.w600,
                                      ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ),
                          content,
                          if (showHotline)
                            Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: TextButton(
                                onPressed: onHotline,
                                child: Text(hotlineLabel),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                  if (_hasActions)
                    Padding(
                      padding: const EdgeInsets.all(24),
                      child: _DialogActions(
                        type: dialogType,
                        primaryButtonLabel: primaryButtonLabel,
                        primaryButtonColor: primaryButtonColor,
                        secondaryButtonColor: secondaryButtonColor,
                        secondaryButtonBackgroundColor:
                            secondaryButtonBackgroundColor,
                        secondaryButtonLabel: secondaryButtonLabel,
                        primaryAction: primaryAction,
                        secondaryAction: secondaryAction,
                        showBtnLoading: showBtnLoading,
                        canCloseDialog: canCloseDialog,
                        primaryButtonRadius: primaryButtonRadius,
                      ),
                    ),
                ],
              ),
              if (showCloseButton)
                PositionedDirectional(
                  top: 12,
                  end: 12,
                  child: IconButton.filledTonal(
                    tooltip: 'Đóng',
                    onPressed: _close,
                    icon: const Icon(Icons.close),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderImage(ColorScheme colorScheme) {
    return SizedBox(
      width: double.infinity,
      height: 200,
      child:
          headerWidget ??
          ColoredBox(
            color: colorScheme.surfaceContainerHighest,
            child: _buildImage(
              imageBackgroundHeaderPath,
              fit: BoxFit.cover,
              excludeFromSemantics: true,
            ),
          ),
    );
  }

  Widget _buildImage(
    String path, {
    double? height,
    Color? color,
    BoxFit fit = BoxFit.cover,
    bool excludeFromSemantics = false,
  }) {
    final uri = Uri.tryParse(path);
    final isNetwork = uri?.scheme == 'http' || uri?.scheme == 'https';
    final image = isNetwork
        ? CustomImage.network(
            path,
            width: double.infinity,
            height: height,
            fit: fit,
            color: color,
          )
        : CustomImage.asset(
            path,
            width: double.infinity,
            height: height,
            fit: fit,
            color: color,
          );

    return excludeFromSemantics ? ExcludeSemantics(child: image) : image;
  }

  void _close() {
    final callback = onClose;
    Get.back<void>();
    callback?.call();
  }
}

class _DialogActions extends StatefulWidget {
  const _DialogActions({
    required this.type,
    this.primaryButtonLabel = '',
    this.secondaryButtonLabel = '',
    this.primaryButtonColor,
    this.primaryAction,
    this.secondaryAction,
    this.secondaryButtonColor,
    this.secondaryButtonBackgroundColor,
    this.showBtnLoading = false,
    this.canCloseDialog = true,
    this.primaryButtonRadius,
  });

  final DialogType type;
  final String primaryButtonLabel;
  final String secondaryButtonLabel;
  final Color? primaryButtonColor;
  final Color? secondaryButtonColor;
  final Color? secondaryButtonBackgroundColor;
  final FutureOr<void> Function()? primaryAction;
  final FutureOr<void> Function()? secondaryAction;
  final bool showBtnLoading;
  final bool canCloseDialog;
  final double? primaryButtonRadius;

  @override
  State<_DialogActions> createState() => _DialogActionsState();
}

class _DialogActionsState extends State<_DialogActions> {
  bool _isExecuting = false;

  DialogType get type => widget.type;
  String get primaryButtonLabel => widget.primaryButtonLabel;
  String get secondaryButtonLabel => widget.secondaryButtonLabel;
  Color? get primaryButtonColor => widget.primaryButtonColor;
  Color? get secondaryButtonColor => widget.secondaryButtonColor;
  Color? get secondaryButtonBackgroundColor =>
      widget.secondaryButtonBackgroundColor;
  FutureOr<void> Function()? get primaryAction => widget.primaryAction;
  FutureOr<void> Function()? get secondaryAction => widget.secondaryAction;
  bool get showBtnLoading => widget.showBtnLoading || _isExecuting;
  bool get canCloseDialog => widget.canCloseDialog;
  double? get primaryButtonRadius => widget.primaryButtonRadius;

  @override
  Widget build(BuildContext context) {
    return switch (type) {
      DialogType.CONFIRM || DialogType.ALERT => Row(
        children: [
          Expanded(child: _secondaryOutlineButton(context)),
          const SizedBox(width: 12),
          Expanded(child: _primaryButton(context)),
        ],
      ),
      DialogType.ALERT_VERTICAL_OUTLINE => Column(
        children: [
          _primaryButton(context),
          const SizedBox(height: 12),
          _secondaryOutlineButton(context),
        ],
      ),
      DialogType.ALERT_VERTICAL => Column(
        children: [
          _primaryButton(context),
          const SizedBox(height: 12),
          _secondaryTextButton(context),
        ],
      ),
      DialogType.FORCE_ACTION => _primaryButton(context),
      DialogType.INFO ||
      DialogType.FOLDED ||
      DialogType.NONE => const SizedBox.shrink(),
    };
  }

  Widget _primaryButton(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return SizedBox(
      width: double.infinity,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: FilledButton(
          onPressed: primaryAction == null || showBtnLoading
              ? null
              : _runPrimaryAction,
          style: FilledButton.styleFrom(
            backgroundColor: primaryButtonColor,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(primaryButtonRadius ?? 100),
            ),
          ),
          child: showBtnLoading
              ? Semantics(
                  label: 'Đang xử lý',
                  child: SizedBox.square(
                    dimension: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: colorScheme.onPrimary,
                    ),
                  ),
                )
              : Text(primaryButtonLabel, textAlign: TextAlign.center),
        ),
      ),
    );
  }

  Widget _secondaryOutlineButton(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final foregroundColor = secondaryButtonColor ?? colorScheme.primary;

    return SizedBox(
      width: double.infinity,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: OutlinedButton(
          onPressed: showBtnLoading ? null : _runSecondaryAction,
          style: OutlinedButton.styleFrom(
            foregroundColor: foregroundColor,
            backgroundColor: secondaryButtonBackgroundColor,
            side: BorderSide(color: foregroundColor),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(primaryButtonRadius ?? 100),
            ),
          ),
          child: Text(secondaryButtonLabel, textAlign: TextAlign.center),
        ),
      ),
    );
  }

  Widget _secondaryTextButton(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return SizedBox(
      width: double.infinity,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: TextButton(
          onPressed: showBtnLoading ? null : _runSecondaryAction,
          style: TextButton.styleFrom(
            foregroundColor: secondaryButtonColor ?? colorScheme.primary,
            backgroundColor: secondaryButtonBackgroundColor,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(primaryButtonRadius ?? 100),
            ),
          ),
          child: Text(secondaryButtonLabel, textAlign: TextAlign.center),
        ),
      ),
    );
  }

  Future<void> _runPrimaryAction() async {
    if (_isExecuting) return;
    final action = primaryAction;
    if (action == null) return;

    setState(() => _isExecuting = true);
    if (canCloseDialog) Get.back<void>();
    try {
      await action();
    } finally {
      if (mounted) setState(() => _isExecuting = false);
    }
  }

  Future<void> _runSecondaryAction() async {
    if (_isExecuting) return;
    final action = secondaryAction;

    setState(() => _isExecuting = true);
    if (canCloseDialog) Get.back<void>();
    try {
      await action?.call();
    } finally {
      if (mounted) setState(() => _isExecuting = false);
    }
  }
}
