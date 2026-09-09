document.addEventListener('DOMContentLoaded', function() {
    let isScrolling = false;
    let scrollEndTimer;

    const tabsContainer = document.getElementById('tabs-container');
    const navTabWrapper  = tabsContainer ? tabsContainer.querySelector('.nav-tab-wrapper') : null;
    const mobileTabRow   = tabsContainer ? tabsContainer.querySelector('.wpte-sticky-tab-mobile') : null;

    function isMobileWidth() {
        return window.innerWidth <= 767;
    }

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
            if ( tabsContainer ) {
                tabsContainer.style.minHeight = navHeight + 'px';
            }
        }

        const adminBar = document.getElementById( 'wpadminbar' );
        let headerOffset = 0;
        if ( adminBar && window.getComputedStyle( adminBar ).position === 'fixed' ) {
            headerOffset = adminBar.offsetHeight;
        }

        const themeHeader = document.querySelector( '.mobile-header' );
        if ( themeHeader && isMobileWidth() ) {
            const themeHeaderStyle = window.getComputedStyle( themeHeader );
            if ( themeHeaderStyle.position === 'sticky' || themeHeaderStyle.position === 'fixed' ) {
                headerOffset += themeHeader.offsetHeight;
            }
        }
        document.documentElement.style.setProperty( '--wpte-tab-pin-offset', headerOffset + 'px' );
    }

    recomputeLayout();

    // Recompute after all resources load (images, web fonts) and on resize/orientation change.
    window.addEventListener( 'load', recomputeLayout );
    window.addEventListener( 'resize', function() {
        clearTimeout( resizeTimer );
        resizeTimer = setTimeout( recomputeLayout, 200 );
    } );

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

            allTabLinks.forEach( a => a.classList.remove('active', 'wpte-nav-tab-active') );
            document.querySelectorAll('.wpte-sticky-tabs a[href="' + target + '"]').forEach( a => a.classList.add('active', 'wpte-nav-tab-active') );

            if ( stickyTabs && targetEl ) {
                const mobile      = isMobileWidth();
                const pinClass    = mobile ? 'wpte-pinned' : 'fixed-header';
                const ownBarHeight = mobile && mobileTabRow ? mobileTabRow.offsetHeight : navHeight;
                const themeOffset  = parseFloat( getComputedStyle( document.documentElement ).getPropertyValue( '--wpte-tab-pin-offset' ) ) || 0;

                const rawTop = targetEl.getBoundingClientRect().top + window.pageYOffset;

                const willBeFixed    = ( rawTop - themeOffset - ownBarHeight ) >= containerOffsetTop;
                const targetPosition = willBeFixed ? ( rawTop - themeOffset - ownBarHeight ) : ( rawTop - themeOffset );

                if ( tabsContainer ) {
                    tabsContainer.classList.toggle( pinClass, willBeFixed );
                    if ( ! mobile ) {
                        document.body.classList.toggle( 'wte-tabs-fixed', willBeFixed );
                    }
                }

                isScrolling = true;
                clearTimeout( scrollEndTimer );
                scrollEndTimer = setTimeout( function() { isScrolling = false; }, 300 );
                window.scrollTo({ top: targetPosition, behavior: 'auto' });
            }
        } );
    } );

    let scrollTicking = false;

    function handleScroll() {
        clearTimeout( scrollEndTimer );
        scrollEndTimer = setTimeout( function() { isScrolling = false; }, 100 );

        const scrollPosition = window.pageYOffset;
        const mobile         = isMobileWidth();

        if ( tabsContainer ) {
            const pinClass = mobile ? 'wpte-pinned' : 'fixed-header';
            const pinned   = scrollPosition >= containerOffsetTop;
            tabsContainer.classList.toggle( pinClass, pinned );
            if ( ! mobile ) {
                document.body.classList.toggle( 'wte-tabs-fixed', pinned );
            } else if ( tabsContainer.classList.contains( 'fixed-header' ) ) {
                tabsContainer.classList.remove( 'fixed-header' );
                document.body.classList.remove( 'wte-tabs-fixed' );
            }
        }

        if ( isScrolling || ! sections.length ) return;

        const stickyTabs = document.querySelector('.wpte-sticky-tabs');
        if ( ! stickyTabs ) return;

        const isFixed      = tabsContainer && tabsContainer.classList.contains( mobile ? 'wpte-pinned' : 'fixed-header' );
        const headerEl     = mobile && mobileTabRow ? mobileTabRow : stickyTabs;
        const headerHeight = isFixed ? headerEl.getBoundingClientRect().bottom : stickyTabs.offsetHeight;

        sections.forEach( function( { el, href } ) {
            const top    = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            const bottom = top + el.offsetHeight;

            if ( scrollPosition >= top && scrollPosition < bottom ) {
                allTabLinks.forEach( a => a.classList.remove('active', 'wpte-nav-tab-active') );
                document.querySelectorAll('.wpte-sticky-tabs a[href="' + href + '"]').forEach( a => a.classList.add('active', 'wpte-nav-tab-active') );
            }
        } );
    }

    window.addEventListener('scroll', function() {
        if ( scrollTicking ) return;
        scrollTicking = true;
        window.requestAnimationFrame( function() {
            handleScroll();
            scrollTicking = false;
        } );
    }, { passive: true } );
} );
