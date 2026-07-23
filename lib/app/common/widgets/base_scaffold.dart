import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:language_learning_app/app/common/widgets/base_footer.dart';
import 'package:language_learning_app/app/common/widgets/custom_image.dart';
import 'package:language_learning_app/app/common/widgets/custom_material_app.dart';
import 'package:language_learning_app/app/common/widgets/status_bar_brightness.dart';

export 'package:language_learning_app/app/common/widgets/status_bar_brightness.dart';

/// Khung trang Material 3 dùng chung, hỗ trợ app bar, footer và chặn quay lại.
///
/// Ví dụ:
/// ```dart
/// BaseScaffold(
///   showAppBar: true,
///   title: 'Bài học',
///   body: const LessonView(),
/// )
/// ```
///
/// Khi cung cấp [onWillPop], thao tác quay lại sẽ chờ kết quả. Đặt [canPop]
/// thành `false` mà không truyền callback để chặn hoàn toàn thao tác quay lại.
class BaseScaffold extends StatelessWidget {
  const BaseScaffold({
    super.key,
    this.body,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.customTitleWidget,
    this.flexibleSpace,
    this.actions,
    this.leadingWidget,
    this.leadingIcon,
    this.onLeadingTap,
    this.showBottomNavigatorBar,
    this.showAppBar = false,
    this.showFootShadow = true,
    this.showLeading = true,
    this.automaticallyImplyLeading = true,
    this.extendBodyBehindAppBar = false,
    this.resizeToAvoidBottomInset = true,
    this.centerTitle = true,
    this.title = '',
    this.appBarTextStyle,
    this.leadingColor,
    this.bottomNavigatorBarBackgroundColor,
    this.footerBorder,
    this.canPop,
    this.bottomNavigationBar,
    this.backgroundColor,
    this.appBarBackgroundColor,
    this.elevation = 0,
    this.statusBarBrightness = StatusBarBrightness.DARK,
    this.onWillPop,
    this.customHeader,
    this.bottomNavigationBarPadding,
  });

  final Widget? body;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final Widget? customTitleWidget;
  final Widget? flexibleSpace;
  final List<Widget>? actions;
  final Widget? leadingWidget;
  final String? leadingIcon;
  final VoidCallback? onLeadingTap;
  final RxBool? showBottomNavigatorBar;
  final bool showAppBar;
  final bool showFootShadow;
  final bool showLeading;
  final bool automaticallyImplyLeading;
  final bool extendBodyBehindAppBar;
  final bool resizeToAvoidBottomInset;
  final bool centerTitle;
  final String title;
  final TextStyle? appBarTextStyle;
  final Color? leadingColor;
  final Color? bottomNavigatorBarBackgroundColor;
  final BoxBorder? footerBorder;
  final bool? canPop;

  /// Nếu truyền một [Column], hãy đặt `mainAxisSize: MainAxisSize.min`.
  final Widget? bottomNavigationBar;

  final Color? backgroundColor;
  final Color? appBarBackgroundColor;
  final double elevation;
  final StatusBarBrightness statusBarBrightness;
  final Future<bool> Function()? onWillPop;

  /// Header nổi trên body. Widget tự xử lý khoảng cách status bar nếu cần.
  final Widget? customHeader;

  final EdgeInsetsGeometry? bottomNavigationBarPadding;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final scaffoldColor = backgroundColor ?? colorScheme.surface;
    final overlayStyle = statusBarBrightness == StatusBarBrightness.DARK
        ? SystemUiOverlayStyle.dark
        : SystemUiOverlayStyle.light;

    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
      child: _BackNavigationScope(
        canPop: canPop,
        onWillPop: onWillPop,
        child: CustomMaterialApp(
          statusBarBrightness: statusBarBrightness,
          child: Scaffold(
            extendBodyBehindAppBar:
                customHeader != null || extendBodyBehindAppBar,
            resizeToAvoidBottomInset: resizeToAvoidBottomInset,
            backgroundColor: scaffoldColor,
            appBar: showAppBar
                ? AppBar(
                    backgroundColor:
                        appBarBackgroundColor ?? colorScheme.surface,
                    foregroundColor: colorScheme.onSurface,
                    toolbarHeight: kToolbarHeight,
                    leadingWidth: showLeading ? kToolbarHeight : 0,
                    shadowColor: colorScheme.shadow.withValues(alpha: 0.15),
                    systemOverlayStyle: overlayStyle.copyWith(
                      statusBarColor: Colors.transparent,
                    ),
                    title:
                        customTitleWidget ??
                        Text(
                          title,
                          style:
                              appBarTextStyle ??
                              theme.textTheme.titleLarge?.copyWith(
                                color: colorScheme.onSurface,
                              ),
                        ),
                    leading: showLeading
                        ? _buildLeadingButton(context)
                        : const SizedBox.shrink(),
                    centerTitle: centerTitle,
                    actions: actions,
                    elevation: elevation,
                    scrolledUnderElevation: elevation,
                    automaticallyImplyLeading: automaticallyImplyLeading,
                    flexibleSpace: flexibleSpace,
                  )
                : null,
            body: customHeader == null
                ? body
                : Stack(
                    fit: StackFit.expand,
                    children: [
                      ?body,
                      Positioned(
                        top: 0,
                        left: 0,
                        right: 0,
                        child: customHeader!,
                      ),
                    ],
                  ),
            bottomNavigationBar: _buildBottomNavigationBar(),
            floatingActionButton: floatingActionButton,
            floatingActionButtonLocation: floatingActionButtonLocation,
          ),
        ),
      ),
    );
  }

  Widget _buildLeadingButton(BuildContext context) {
    final effectiveColor =
        leadingColor ?? Theme.of(context).colorScheme.onSurface;
    final icon =
        leadingWidget ??
        (leadingIcon == null
            ? const Icon(Icons.arrow_back)
            : CustomImage.asset(
                leadingIcon!,
                width: 24,
                height: 24,
                color: effectiveColor,
                semanticLabel: 'Quay lại',
              ));

    return IconButton(
      onPressed: onLeadingTap ?? Get.back,
      tooltip: 'Quay lại',
      color: effectiveColor,
      icon: icon,
    );
  }

  Widget? _buildBottomNavigationBar() {
    if (bottomNavigationBar == null) return null;

    Widget footer() {
      return BaseFooter(
        showShadow: showFootShadow,
        backgroundColor: bottomNavigatorBarBackgroundColor,
        border: footerBorder,
        padding: bottomNavigationBarPadding,
        child: bottomNavigationBar,
      );
    }

    final visibility = showBottomNavigatorBar;
    if (visibility == null) return footer();

    return Obx(
      () => AnimatedSize(
        duration: const Duration(milliseconds: 150),
        child: visibility.value ? footer() : const SizedBox.shrink(),
      ),
    );
  }
}

class _BackNavigationScope extends StatefulWidget {
  const _BackNavigationScope({
    required this.canPop,
    required this.onWillPop,
    required this.child,
  });

  final bool? canPop;
  final Future<bool> Function()? onWillPop;
  final Widget child;

  @override
  State<_BackNavigationScope> createState() => _BackNavigationScopeState();
}

class _BackNavigationScopeState extends State<_BackNavigationScope> {
  bool _allowNextPop = false;
  bool _isChecking = false;

  bool get _canPop {
    if (_allowNextPop) return true;
    if (widget.onWillPop != null) return false;
    return widget.canPop ?? true;
  }

  @override
  void didUpdateWidget(covariant _BackNavigationScope oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.canPop != widget.canPop ||
        oldWidget.onWillPop != widget.onWillPop) {
      _allowNextPop = false;
    }
  }

  Future<void> _handlePop(bool didPop, Object? result) async {
    if (didPop || _isChecking) return;

    final callback = widget.onWillPop;
    if (callback == null) return;

    _isChecking = true;
    bool shouldPop;
    try {
      shouldPop = await callback();
    } finally {
      _isChecking = false;
    }

    if (!shouldPop || !mounted) return;

    setState(() => _allowNextPop = true);
    await WidgetsBinding.instance.endOfFrame;
    if (mounted) Navigator.of(context).pop(result);
  }

  @override
  Widget build(BuildContext context) {
    return PopScope<Object?>(
      canPop: _canPop,
      onPopInvokedWithResult: _handlePop,
      child: widget.child,
    );
  }
}
