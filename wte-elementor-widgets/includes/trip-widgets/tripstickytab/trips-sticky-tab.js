document.addEventListener('DOMContentLoaded', function() {
    let isScrolling = false;
    let scrollEndTimer;

    const tabsContainer = document.getElementById('tabs-container');
    const navTabWrapper  = tabsContainer ? tabsContainer.querySelector('.nav-tab-wrapper') : null;

    let containerOffsetTop = 0;
    let navHeight          = 0;
    let resizeTimer;

    function recomputeLayout() {
        containerOffsetTop = 0;
        if ( tabsContainer ) {
            let el = tabsContainer;
            while ( el ) {
                containerOffsetTop += el.offsetTop;
                el = el.offsetParent;
            }
        }
        if ( navTabWrapper ) {
            navHeight = navTabWrapper.offsetHeight;
        }
    }

    recomputeLayout();

    // Recompute after all resources load (images, web fonts) and on resize/orientation change.
    window.addEventListener( 'load', recomputeLayout );
    window.addEventListener( 'resize', function() {
        clearTimeout( resizeTimer );
        resizeTimer = setTimeout( recomputeLayout, 200 );
    } );

    // Fixed-header takes .nav-tab-wrapper out of flow; lock container min-height to prevent layout shift.
    if ( tabsContainer && navTabWrapper ) {
        new MutationObserver( function() {
            tabsContainer.style.minHeight = tabsContainer.classList.contains('fixed-header')
                ? navHeight + 'px'
                : '';
        } ).observe( tabsContainer, { attributes: true, attributeFilter: ['class'] } );
    }

    const allTabLinks = document.querySelectorAll('.wpte-sticky-tabs a');

    // Build section map from tab href values — works in Elementor context where
    // .wpte-tab-content elements don't exist.
    const sections = [];
    allTabLinks.forEach( function( link ) {
        const href = link.getAttribute('href');
        if ( href && href.startsWith('#') ) {
            const el = document.querySelector(href);
            if ( el && ! sections.find( s => s.el === el ) ) {
                sections.push( { el, href } );
            }
        }
    } );

    // Tab click — instant scroll avoids mid-scroll fixed-header layout shift.
    allTabLinks.forEach( function( link ) {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const target     = this.getAttribute('href');
            const targetEl   = document.querySelector(target);
            const stickyTabs = document.querySelector('.wpte-sticky-tabs');

            allTabLinks.forEach( a => a.classList.remove('active', 'nav-tab-active') );
            document.querySelectorAll('.wpte-sticky-tabs a[href="' + target + '"]').forEach( a => a.classList.add('active', 'nav-tab-active') );

            if ( stickyTabs && targetEl ) {
                const wasFixed = tabsContainer && tabsContainer.classList.contains( 'fixed-header' );
                if ( tabsContainer && ! wasFixed ) {
                    tabsContainer.classList.add( 'fixed-header' );
                    document.body.classList.add( 'wte-tabs-fixed' );
                    tabsContainer.style.minHeight = navTabWrapper ? navTabWrapper.offsetHeight + 'px' : '';
                }

                const headerHeight   = stickyTabs.getBoundingClientRect().bottom;
                const rawTop         = targetEl.getBoundingClientRect().top + window.pageYOffset;
                const willBeFixed    = ( rawTop - headerHeight ) >= containerOffsetTop;
                const targetPosition = willBeFixed ? rawTop - headerHeight : rawTop;

                // Target sits above the sticky trigger point — revert the forced state.
                if ( tabsContainer && ! wasFixed && ! willBeFixed ) {
                    tabsContainer.classList.remove( 'fixed-header' );
                    document.body.classList.remove( 'wte-tabs-fixed' );
                    tabsContainer.style.minHeight = '';
                }

                isScrolling = true;
                clearTimeout( scrollEndTimer );
                scrollEndTimer = setTimeout( function() { isScrolling = false; }, 300 );
                window.scrollTo({ top: targetPosition });
            }
        } );
    } );

    // Scroll handler — sticky toggle + scroll spy.
    window.addEventListener('scroll', function() {
        clearTimeout( scrollEndTimer );
        scrollEndTimer = setTimeout( function() { isScrolling = false; }, 100 );

        const scrollPosition = window.pageYOffset;

        // Toggle fixed-header: WTE core has this logic commented out, so we own it.
        if ( tabsContainer ) {
            tabsContainer.classList.toggle( 'fixed-header', scrollPosition >= containerOffsetTop );
            document.body.classList.toggle( 'wte-tabs-fixed', scrollPosition >= containerOffsetTop );
        }

        if ( isScrolling || ! sections.length ) return;

        const stickyTabs = document.querySelector('.wpte-sticky-tabs');
        if ( ! stickyTabs ) return;

        const isFixed        = tabsContainer && tabsContainer.classList.contains( 'fixed-header' );
        const headerHeight   = isFixed ? stickyTabs.getBoundingClientRect().bottom : stickyTabs.offsetHeight;

        sections.forEach( function( { el, href } ) {
            const top    = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            const bottom = top + el.offsetHeight;

            if ( scrollPosition >= top && scrollPosition < bottom ) {
                allTabLinks.forEach( a => a.classList.remove('active', 'nav-tab-active') );
                document.querySelectorAll('.wpte-sticky-tabs a[href="' + href + '"]').forEach( a => a.classList.add('active', 'nav-tab-active') );
            }
        } );
    } );
} );
