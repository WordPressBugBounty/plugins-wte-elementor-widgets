(function ($) {

    "use strict";

    let elementIndex = null;
    let currentAjaxRequest;

    function addLibraryButton(elementorPreview) {
        const libraryButton = '<div id="cw-layout-btn" class="elementor-add-section-area-button transform-scale">' + etAdmin.btnIcon + '</div>';
        const elementorAddSection = $("#tmpl-elementor-add-section");
        const elementorAddSectionText = elementorAddSection.text();
        const updatedText = elementorAddSectionText.replace('<div class="elementor-add-section-drag-title', libraryButton + '<div class="elementor-add-section-drag-title');
        elementorAddSection.text(updatedText);

        $(elementorPreview).on('click', '.elementor-editor-element-settings .elementor-editor-element-add', function () {
            const modelID = $(this).closest('.elementor-element').data('model-cid');

            // Find element index when user tries to append new element between sections
            if (window.elementor.elements.models.length) {
                $.each(window.elementor.elements.models, function (index, model) {
                    if (modelID === model.cid) {
                        elementIndex = index;
                    }
                });
            }
        });
    }

    function getTemplatesModal(elementorPreview) {

        // Popup
        elementorPreview.on('click', '#cw-layout-btn', function () {

            const body = elementorPreview.find('body');
            const html = elementorPreview.find('html');

            if (elementorPreview.find('.cw-template-modal').length == 0) {

                body.append(`
                <div class="cw-template-modal-overlay">
                    <div class="cw-template-modal">
                        <div class="cw-header">
                            <div class="cw-header-left">
                                <span class="cw-header-title">
                                    <svg width="325" height="42" viewBox="0 0 325 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M78.88 30L73.7 10.4H77.536L81.064 25.996L85.208 10.4H89.156L93.188 25.996L96.716 10.4H100.58L95.26 30H91.004L87.112 15.468L83.108 30H78.88ZM102.617 30V10.4H109.869C111.437 10.4 112.735 10.6613 113.761 11.184C114.788 11.7067 115.553 12.4253 116.057 13.34C116.561 14.2547 116.813 15.2813 116.813 16.42C116.813 17.5027 116.571 18.5013 116.085 19.416C115.6 20.312 114.844 21.04 113.817 21.6C112.791 22.1413 111.475 22.412 109.869 22.412H106.201V30H102.617ZM106.201 19.5H109.645C110.896 19.5 111.792 19.2293 112.333 18.688C112.893 18.128 113.173 17.372 113.173 16.42C113.173 15.4493 112.893 14.6933 112.333 14.152C111.792 13.592 110.896 13.312 109.645 13.312H106.201V19.5Z" fill="#3F494B"/>
                                        <path d="M129.741 30V13.284H124.029V10.4H139.065V13.284H133.325V30H129.741ZM139.709 30V16.112H142.901L143.237 18.716C143.741 17.82 144.422 17.1107 145.281 16.588C146.158 16.0467 147.185 15.776 148.361 15.776V19.556H147.353C146.569 19.556 145.869 19.6773 145.253 19.92C144.637 20.1627 144.152 20.5827 143.797 21.18C143.461 21.7773 143.293 22.608 143.293 23.672V30H139.709ZM155.038 30.336C153.844 30.336 152.864 30.1493 152.098 29.776C151.333 29.384 150.764 28.8707 150.39 28.236C150.017 27.6013 149.83 26.9013 149.83 26.136C149.83 24.848 150.334 23.8027 151.342 23C152.35 22.1973 153.862 21.796 155.878 21.796H159.406V21.46C159.406 20.508 159.136 19.808 158.594 19.36C158.053 18.912 157.381 18.688 156.578 18.688C155.85 18.688 155.216 18.8653 154.674 19.22C154.133 19.556 153.797 20.06 153.666 20.732H150.166C150.26 19.724 150.596 18.8467 151.174 18.1C151.772 17.3533 152.537 16.784 153.47 16.392C154.404 15.9813 155.449 15.776 156.606 15.776C158.585 15.776 160.144 16.2707 161.282 17.26C162.421 18.2493 162.99 19.6493 162.99 21.46V30H159.938L159.602 27.76C159.192 28.5067 158.613 29.1227 157.866 29.608C157.138 30.0933 156.196 30.336 155.038 30.336ZM155.85 27.536C156.877 27.536 157.67 27.2 158.23 26.528C158.809 25.856 159.173 25.0253 159.322 24.036H156.27C155.318 24.036 154.637 24.2133 154.226 24.568C153.816 24.904 153.61 25.324 153.61 25.828C153.61 26.3693 153.816 26.7893 154.226 27.088C154.637 27.3867 155.178 27.536 155.85 27.536ZM169.192 30L164.096 16.112H167.848L171.376 26.612L174.904 16.112H178.656L173.532 30H169.192ZM186.421 30.336C185.021 30.336 183.78 30.0373 182.697 29.44C181.615 28.8427 180.765 28.0027 180.149 26.92C179.533 25.8373 179.225 24.5867 179.225 23.168C179.225 21.7307 179.524 20.452 180.121 19.332C180.737 18.212 181.577 17.344 182.641 16.728C183.724 16.0933 184.993 15.776 186.449 15.776C187.812 15.776 189.016 16.0747 190.061 16.672C191.107 17.2693 191.919 18.0907 192.497 19.136C193.095 20.1627 193.393 21.3107 193.393 22.58C193.393 22.7853 193.384 23 193.365 23.224C193.365 23.448 193.356 23.6813 193.337 23.924H182.781C182.856 25.0067 183.229 25.856 183.901 26.472C184.592 27.088 185.423 27.396 186.393 27.396C187.121 27.396 187.728 27.2373 188.213 26.92C188.717 26.584 189.091 26.1547 189.333 25.632H192.973C192.712 26.5093 192.273 27.312 191.657 28.04C191.06 28.7493 190.313 29.3093 189.417 29.72C188.54 30.1307 187.541 30.336 186.421 30.336ZM186.449 18.688C185.572 18.688 184.797 18.94 184.125 19.444C183.453 19.9293 183.024 20.676 182.837 21.684H189.753C189.697 20.7693 189.361 20.0413 188.745 19.5C188.129 18.9587 187.364 18.688 186.449 18.688ZM195.848 30V9.84H199.432V30H195.848ZM208.73 30V10.4H221.526V13.284H212.314V18.66H220.686V21.46H212.314V27.116H221.526V30H208.73ZM224.273 30V16.112H227.437L227.717 18.464C228.147 17.6427 228.763 16.9893 229.565 16.504C230.387 16.0187 231.348 15.776 232.449 15.776C234.167 15.776 235.501 16.3173 236.453 17.4C237.405 18.4827 237.881 20.0693 237.881 22.16V30H234.297V22.496C234.297 21.3013 234.055 20.3867 233.569 19.752C233.084 19.1173 232.328 18.8 231.301 18.8C230.293 18.8 229.463 19.1547 228.809 19.864C228.175 20.5733 227.857 21.5627 227.857 22.832V30H224.273ZM246.628 25.856C245.956 25.856 245.331 25.7813 244.752 25.632L243.716 26.668C244.034 26.836 244.463 26.976 245.004 27.088C245.546 27.2 246.423 27.312 247.636 27.424C249.484 27.592 250.828 28.0307 251.668 28.74C252.508 29.4493 252.928 30.4293 252.928 31.68C252.928 32.5013 252.704 33.276 252.256 34.004C251.808 34.7507 251.118 35.348 250.184 35.796C249.251 36.2627 248.056 36.496 246.6 36.496C244.622 36.496 243.026 36.1227 241.812 35.376C240.599 34.648 239.992 33.5467 239.992 32.072C239.992 30.8213 240.599 29.7387 241.812 28.824C241.439 28.656 241.112 28.4787 240.832 28.292C240.571 28.1053 240.338 27.9093 240.132 27.704V27.06L242.568 24.484C241.486 23.532 240.944 22.3093 240.944 20.816C240.944 19.8827 241.168 19.0333 241.616 18.268C242.083 17.5027 242.736 16.896 243.576 16.448C244.416 16 245.434 15.776 246.628 15.776C247.412 15.776 248.14 15.888 248.812 16.112H254.076V18.296L251.696 18.464C252.07 19.1733 252.256 19.9573 252.256 20.816C252.256 21.7493 252.032 22.5987 251.584 23.364C251.136 24.1293 250.483 24.736 249.624 25.184C248.784 25.632 247.786 25.856 246.628 25.856ZM246.628 23.112C247.356 23.112 247.954 22.916 248.42 22.524C248.906 22.132 249.148 21.572 249.148 20.844C249.148 20.116 248.906 19.556 248.42 19.164C247.954 18.772 247.356 18.576 246.628 18.576C245.863 18.576 245.247 18.772 244.78 19.164C244.314 19.556 244.08 20.116 244.08 20.844C244.08 21.572 244.314 22.132 244.78 22.524C245.247 22.916 245.863 23.112 246.628 23.112ZM243.268 31.708C243.268 32.3987 243.586 32.912 244.22 33.248C244.874 33.6027 245.667 33.78 246.6 33.78C247.496 33.78 248.224 33.5933 248.784 33.22C249.344 32.8653 249.624 32.38 249.624 31.764C249.624 31.26 249.438 30.84 249.064 30.504C248.71 30.168 247.991 29.9627 246.908 29.888C246.143 29.832 245.434 29.748 244.78 29.636C244.239 29.9347 243.847 30.2613 243.604 30.616C243.38 30.9707 243.268 31.3347 243.268 31.708ZM258.062 13.956C257.409 13.956 256.867 13.76 256.438 13.368C256.027 12.976 255.822 12.4813 255.822 11.884C255.822 11.2867 256.027 10.8013 256.438 10.428C256.867 10.036 257.409 9.84 258.062 9.84C258.715 9.84 259.247 10.036 259.658 10.428C260.087 10.8013 260.302 11.2867 260.302 11.884C260.302 12.4813 260.087 12.976 259.658 13.368C259.247 13.76 258.715 13.956 258.062 13.956ZM256.27 30V16.112H259.854V30H256.27ZM263.035 30V16.112H266.199L266.479 18.464C266.908 17.6427 267.524 16.9893 268.327 16.504C269.148 16.0187 270.109 15.776 271.211 15.776C272.928 15.776 274.263 16.3173 275.215 17.4C276.167 18.4827 276.643 20.0693 276.643 22.16V30H273.059V22.496C273.059 21.3013 272.816 20.3867 272.331 19.752C271.845 19.1173 271.089 18.8 270.063 18.8C269.055 18.8 268.224 19.1547 267.571 19.864C266.936 20.5733 266.619 21.5627 266.619 22.832V30H263.035ZM286.258 30.336C284.858 30.336 283.617 30.0373 282.534 29.44C281.451 28.8427 280.602 28.0027 279.986 26.92C279.37 25.8373 279.062 24.5867 279.062 23.168C279.062 21.7307 279.361 20.452 279.958 19.332C280.574 18.212 281.414 17.344 282.478 16.728C283.561 16.0933 284.83 15.776 286.286 15.776C287.649 15.776 288.853 16.0747 289.898 16.672C290.943 17.2693 291.755 18.0907 292.334 19.136C292.931 20.1627 293.23 21.3107 293.23 22.58C293.23 22.7853 293.221 23 293.202 23.224C293.202 23.448 293.193 23.6813 293.174 23.924H282.618C282.693 25.0067 283.066 25.856 283.738 26.472C284.429 27.088 285.259 27.396 286.23 27.396C286.958 27.396 287.565 27.2373 288.05 26.92C288.554 26.584 288.927 26.1547 289.17 25.632H292.81C292.549 26.5093 292.11 27.312 291.494 28.04C290.897 28.7493 290.15 29.3093 289.254 29.72C288.377 30.1307 287.378 30.336 286.258 30.336ZM286.286 18.688C285.409 18.688 284.634 18.94 283.962 19.444C283.29 19.9293 282.861 20.676 282.674 21.684H289.59C289.534 20.7693 289.198 20.0413 288.582 19.5C287.966 18.9587 287.201 18.688 286.286 18.688Z" fill="url(#paint0_linear_79721_30)"/>
                                        <g clip-path="url(#clip0_79721_30)">
                                        <path d="M61.4482 21.3508C62.2879 20.0931 61.0376 19.0332 61.0376 19.0332C61.0376 19.0332 59.5784 18.2906 58.7424 19.5482C57.9027 20.8059 55.7867 23.9856 55.7867 23.9856L47.1545 24.1872L45.7064 26.3592L53.0361 28.1095L49.7482 32.0804C50.7708 32.4798 51.6404 33.215 52.6256 33.7076L55.7419 29.9121L60.1793 36.0028L61.6273 33.8308L58.4887 25.7882C58.4924 25.7882 60.6122 22.6085 61.4482 21.3508Z" fill="#3F494B"/>
                                        <path d="M30.6514 19.5632C33.2587 19.5632 35.3724 17.4495 35.3724 14.8421C35.3724 12.2348 33.2587 10.1211 30.6514 10.1211C28.044 10.1211 25.9304 12.2348 25.9304 14.8421C25.9304 17.4495 28.044 19.5632 30.6514 19.5632Z" fill="url(#paint1_linear_79721_30)"/>
                                        <path d="M56.7943 25.0605C56.0105 24.5678 54.973 24.8029 54.4804 25.5904C49.681 33.2112 44.6689 37.3762 39.9852 37.63C34.055 37.9584 30.1513 32.1849 26.7439 28.3297C24.9376 26.2846 23.2955 24.1013 21.8624 21.78C20.7279 19.9476 19.4739 17.7569 19.4739 15.54C19.4702 9.3747 24.486 4.35884 30.6513 4.35884C36.8129 4.35884 41.8288 9.3747 41.8288 15.54C41.8288 19.231 37.3877 25.1426 33.5735 29.4568C32.9727 30.136 33.0399 31.1698 33.7079 31.7856C33.7191 31.7931 33.7266 31.8043 33.7377 31.8117C34.417 32.4387 35.4843 32.379 36.0964 31.6886C40.0374 27.2586 45.1914 20.5148 45.1914 15.5363C45.1876 7.51987 38.6678 1 30.6513 1C22.6349 1 16.1113 7.51987 16.1113 15.54C16.1113 20.2237 20.6756 26.4712 24.5084 30.8936L24.4972 30.8824C25.5123 31.8416 26.3856 33.0022 27.3448 34.0211C29.2071 35.9916 31.1104 38.0927 33.5026 39.4139C33.5064 39.4176 33.5138 39.4176 33.5288 39.4288C35.1298 40.3021 37.1488 41 39.5149 41C39.7127 41 39.9143 40.9963 40.1195 40.9851C46.0348 40.6902 51.8232 36.111 57.3205 27.3781C57.8169 26.5943 57.578 25.5568 56.7943 25.0605Z" fill="#3F494B"/>
                                        <path d="M27.0388 37.2459C26.5499 36.7831 25.8333 36.6674 25.2138 36.9287C24.0942 37.3989 22.7842 37.7124 21.3175 37.6303C16.6338 37.3765 11.6217 33.2116 6.84097 25.6169L3.11639 19.4478C2.63869 18.6529 1.60492 18.3991 0.813725 18.8768C0.0188002 19.3582 -0.23871 20.3883 0.242723 21.1832L3.98223 27.3784C9.47952 36.1114 15.2679 40.6906 21.1832 40.9854C21.3885 40.9966 21.59 41.0003 21.7878 41.0003C23.5754 41.0003 25.169 40.601 26.5312 40.0263C27.6545 39.5523 27.9307 38.0893 27.0462 37.2496L27.0388 37.2459Z" fill="url(#paint2_linear_79721_30)"/>
                                        </g>
                                        <defs>
                                        <linearGradient id="paint0_linear_79721_30" x1="12.4545" y1="-3.56364" x2="32.0827" y2="105.443" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#1FC0A1"/>
                                        <stop stop-color="#1FC0A1"/>
                                        <stop offset="1" stop-color="#00A89F"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_79721_30" x1="23.3553" y1="8.66187" x2="38.0334" y2="21.8808" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#1FC0A1"/>
                                        <stop stop-color="#1FC0A1"/>
                                        <stop offset="1" stop-color="#00A89F"/>
                                        </linearGradient>
                                        <linearGradient id="paint2_linear_79721_30" x1="-7.51925" y1="15.1794" x2="27.2481" y2="53.7788" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#1FC0A1"/>
                                        <stop stop-color="#1FC0A1"/>
                                        <stop offset="1" stop-color="#00A89F"/>
                                        </linearGradient>
                                        <clipPath id="clip0_79721_30">
                                        <rect width="61.7391" height="40" fill="white" transform="translate(0 1)"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                                <button class="cw-header-back-btn transform-scale">
                                    <i class="eicon-arrow-left" aria-hidden="true"></i>
                                    <span>${etAdmin.templatesText.back}</span>
                                </button>
                            </div>
                            ${tabSwitcher()}
                            <div class="cw-header-right">
                                <button class="cw-header-insert-temp cw-insert-temp transform-scale" data-slug-id="">${etAdmin.templatesText.import}</button>
                                <span class="divider"></span>
                                <div class="cw-close"><i class="eicon-close"></i></div>
                            </div>
                        </div>
                        <div class="cw-template-modal-body">
                            <div class="cw-content-wrap">
                            </div>
                            <div class="cw-preview-wrap"></div>
                        </div>
                    </div>
                </div>
                `);
            }
            //Show Overlay
            html.css('overflow', 'hidden');
            elementorPreview.find('.cw-template-modal-overlay').show();
            //Close Overlay
            elementorPreview.find('.cw-close').on('click', function () {
                html.css('overflow', 'auto');
                elementorPreview.find('.cw-template-modal-overlay').fadeOut('fast', function () {
                    elementorPreview.find('.cw-template-modal-overlay').remove();
                });
            });

            displayTemplates(elementorPreview)
        });
    }

    function displayTemplates(elementorPreview, serverToFetch = 'travel-monster') {

        const contentWrap = elementorPreview.find('.cw-content-wrap');
        const templateModalLoader = elementorPreview.find('.cw-template-modal-loader-wrapper');

        contentWrap.html(loadingElementorPreview());

        if (currentAjaxRequest) {
            currentAjaxRequest.abort();
        }

        // AJAX Data
        let data = {
            action: 'render_templates_designs',
            server: serverToFetch
        };

        currentAjaxRequest = $.post(etAdmin.ajaxURL, data)
            .done(function (response) {
                contentWrap.html(response);
                runCategoryFilter(elementorPreview);
                toggleLayout(elementorPreview);
                importTemplates(elementorPreview, serverToFetch);
                runSearchFilter(elementorPreview);
                templatePreview(elementorPreview);
                getDemoListValue(elementorPreview);
                templateModalLoader.remove();
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                // Check if the request was aborted
                if (jqXHR.statusText === 'abort') {
                    console.log('AJAX request aborted');
                    return; // No need to further handle this case
                }

                templateModalLoader.remove();
                contentWrap.html('<div class="cw-error">Error: ' + errorThrown + '</div>');
                console.error("AJAX request failed:", textStatus, errorThrown);
            });
    }

    // toggle layout
    function toggleLayout(elementorPreview) {

        const layoutTwo = elementorPreview.find('.cw-layout-two');
        const layoutThree = elementorPreview.find('.cw-layout-three');
        const designList = elementorPreview.find('.cw-pattern-library__design-list');
        const layoutBlock = elementorPreview.find('.cw-layout-block');
        const layoutPage = elementorPreview.find('.cw-layout-page');

        elementorPreview.on('click', '.cw-layout-two', function () {
            designList.addClass('column2');
            $(this).addClass('active');
            layoutThree.removeClass('active');
        });

        elementorPreview.on('click', '.cw-layout-three', function () {
            designList.removeClass('column2');
            $(this).addClass('active');
            layoutTwo.removeClass('active');
        });

        elementorPreview.on('click', '.cw-layout-block', function () {
            layoutPage.removeClass('active');
            $(this).addClass('active');
        });

        elementorPreview.on('click', '.cw-layout-page', function () {
            layoutBlock.removeClass('active');
            $(this).addClass('active');
        });
    }

    // category filter
    function runCategoryFilter(elementorPreview) {
        elementorPreview.on('click', '.cw-cat-item', function () {
            elementorPreview.find('.cw-pattern-library__category ul li button').removeClass('tab-active');
            $(this).addClass('tab-active');
            let categorySlugs = $(this).attr('data-filter').split(' ');

            elementorPreview.find('.cw-pattern-library__design-item').hide();

            if (categorySlugs.includes('all')) {
                elementorPreview.find('.cw-pattern-library__design-item').show();

            } else {
                categorySlugs.forEach(function (categorySlug) {
                    elementorPreview.find(`.cw-pattern-library__design-item[data-filter*=${categorySlug}`).show();
                });
            }
        });
    }

    function runSearchFilter(elementorPreview) {
        let debouncedSearch = debounce(function (event) {
            let searchValue = $(event.target).val().toLowerCase();
            let found = false;
            elementorPreview.find('.cw-pattern-library__design-item').each(function () {
                let title = $(this).attr('data-filter-name').toLowerCase();
                if (title.indexOf(searchValue) > -1) {
                    $(this).show();
                    found = true;
                } else {
                    $(this).hide();
                }
            });
            elementorPreview.find('.cw-no-results').remove();
            if (!found) {
                elementorPreview.find('.cw-pattern-library__design-list').append(noResultPreview());
            }
        }, 300)
        elementorPreview.on('keyup', '#cw-search-control', debouncedSearch)
    }

    async function fetchRequiredPlugins(server = 'travel-monster') {
        let response = await fetch(`https://wptravelenginedemo.com/${server}/wp-json/wpte-elementor-templates/v1/patterns/`);
        let designApi = await response.json();
        const requiredPlugins = {};
        for (let dataContent of designApi) {
            if (dataContent.meta && dataContent.meta.required_plugins) {
                requiredPlugins[dataContent.id] = dataContent.meta.required_plugins;
            }
        }
        return requiredPlugins;
    }

    function importTemplates(elementorPreview, value) {
        elementorPreview.find('.cw-insert-temp').on('click', function () {
            let templateID = $(this).attr('data-slug-id');

            const modal = elementorPreview.find('.cw-template-modal');

            let patternsData = fetchRequiredPlugins(value);

            patternsData.then(data => {

                let pluginsLists = data[templateID]?.filter(requiredPlugin =>
                    !etAdmin.activePlugin.some(activePlugin => activePlugin.name === requiredPlugin.name)
                );

                if (pluginsLists && pluginsLists.length > 0) {
                    modal.append(`
                    <dialog class="cw-plugins-dialog">
                        <div class="cw-plugins-dialog-wrapper">
                            <div class="header">
                                <h2>Required Plugins</h2>
                                <button id="cw-plugins-dialog-close" aria-label="close" type="button">
                                    <i class="eicon-close" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div class="cw-plugins-dialog-content">
                                <p> To use this template, please install and activate the required plugins. Once completed, you can return to this page to proceed. </p> 
                                <ol class="plugins-list">
                                    ${pluginsLists.map(plugin =>
                        `<li>
                                      ${plugin.name} - <a class="plugins-link" href="${etAdmin.url}/wp-admin/plugin-install.php?s=${plugin.slug}&tab=search&type=term" target="_blank">Install here</a>
                                    </li>`).join('')} 
                                    
                                </ol>
                                <span>
                                    After activating plugins, make sure to <a class="reload-page" href="javascript:void(0)"}>Reload</a> the page.
                                </span>
                                    
                                </p>
                            </div>
                        </div>
                    </dialog>
                    `);
                    // Close functionality
                    modal.on('click', '#cw-plugins-dialog-close', function () {
                        modal.find('.cw-plugins-dialog').remove();
                    });
                    modal.on('click', 'a[target="_blank"]', function () {
                        window.open(this.href, '_blank');
                    });
                    modal.on('click', '.reload-page', function () {
                        location.reload();
                    });
                    return;
                } else {

                    $(this).attr("disabled", true);

                    let contentURL = `https://wptravelenginedemo.com/${value}/wp-json/wpte-elementor-templates/v1/patterns/${templateID}`;

                    $.ajax({
                        url: etAdmin.ajaxURL,
                        type: 'POST',
                        data: {
                            action: 'process_data_for_import',
                            nonce: etAdmin.nonce,
                            apiURL: contentURL
                        },
                        beforeSend: function () {
                            console.groupCollapsed('Inserting Demo.');
                            elementorPreview.find('.cw-template-modal-body').append(loadingElementorPreview(`${etAdmin.templatesText.stay}`));
                        },
                    })
                        .fail(function (jqXHR) {
                            let errorMessage = jqXHR.statusText;
                            console.log(errorMessage);
                            elementorPreview.find('.cw-template-modal-loader-wrapper').remove();
                        })
                        .done(function (response) {

                            let contentData = response.data;

                            // Import elementor templates and enable update button
                            window.elementor.getPreviewView().addChildModel(contentData, { at: elementIndex });
                            window.elementor.panel.$el.find('#elementor-panel-footer-saver-publish button').removeClass('elementor-disabled');
                            window.elementor.panel.$el.find('#elementor-panel-footer-saver-options button').removeClass('elementor-disabled');

                            // Reset Element index if it has been updated
                            elementIndex = null;

                            elementorPreview.find('.cw-template-modal-loader-wrapper').remove();

                            // Close Library
                            elementorPreview.find('.cw-close').trigger('click');
                        });
                }
            });
        });

    }

    function templatePreview(elementorPreview) {
        const previewWrap = elementorPreview.find('.cw-preview-wrap');
        elementorPreview.on('click', '.cw-pattern-library__design-preview-btn', function () {

            const dataSlugId = $(this).attr('data-slug-id');
            elementorPreview.find('.cw-header .cw-insert-temp').attr('data-slug-id', dataSlugId);

            const templateURL = $(this).attr('data-preview-url');

            elementorPreview.find('.cw-content-wrap').hide();

            elementorPreview.find('.cw-template-modal').addClass('preview-active');
            previewWrap.css("--cw-header-height", elementorPreview.find('.cw-header').outerHeight() + 'px');
            previewWrap.append(loadingElementorPreview());
            previewWrap.append(templateIframe(templateURL));
            previewWrap.find('#cw-template-preview').on('load', function () {
                previewWrap.find('.cw-template-modal-loader-wrapper').remove();
            });

        })

        switchPreviewTab(elementorPreview);

        getBackToTemplates(elementorPreview);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        }
    }

    function getBackToTemplates(elementorPreview) {
        elementorPreview.on('click', '.cw-header-back-btn', function () {
            elementorPreview.find('.cw-content-wrap').show();
            elementorPreview.find('.cw-template-modal').removeClass('preview-active');
            elementorPreview.find('.cw-preview-wrap').empty();
            elementorPreview.find('.cw-template-modal-loader-wrapper').remove();
        });
    }

    // switch preview tab
    function switchPreviewTab(elementorPreview) {
        elementorPreview.on('change', 'input[name="template-preivew-group"]', function () {
            elementorPreview.find('.cw-preview-wrap').css('--iframe-width', $(this).val());
        });
    }

    // No Result Preivew
    function noResultPreview() {
        return (`
            <div class="cw-no-results">
                <div class="cw-no-results-title">No results found</div>
                <div class="cw-no-results-message">Please make sure your search is spelled correctly or try a different words.</div>
            </div>
        `)
    }

    // Loading Elementor Preview
    function loadingElementorPreview($content = null) {
        return (`
            <div class="cw-template-modal-loader-wrapper">
                <div class="cw-template-modal-loader">
                    <div class="cw-template-modal-loader-boxes">
                        <div class="cw-template-modal-loader-box"></div>
                        <div class="cw-template-modal-loader-box"></div>
                        <div class="cw-template-modal-loader-box"></div>
                        <div class="cw-template-modal-loader-box"></div>
                    </div>
                </div>
                <div class="cw-template-modal-loading-title">${$content ? $content : etAdmin.templatesText.loading}</div>
            </div>
        `);
    }

    // template iframe
    function templateIframe(templateURL) {
        return (`
                    <iframe id="cw-template-preview" loading="lazy" allow="fullscreen" style="border-style: none;width: 100%; height: 100%; transition: 0.3s; border-radius: 8px"  src=${templateURL} >
                    </iframe>
                `)
    }

    // tab switcher
    function tabSwitcher() {
        return (`
        <div class="controls-container">
            <div class="controls ready">
                <div class="segment transform-scale ">
                    <input type="radio" id="Desktop" name="template-preivew-group" value="100%" checked="">
                    <label for="Desktop"><svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.16666 17.5H13.8333M10.5 14.1667V17.5M6.16666 14.1667H14.8333C16.2335 14.1667 16.9335 14.1667 17.4683 13.8942C17.9387 13.6545 18.3212 13.272 18.5608 12.8016C18.8333 12.2669 18.8333 11.5668 18.8333 10.1667V6.5C18.8333 5.09987 18.8333 4.3998 18.5608 3.86502C18.3212 3.39462 17.9387 3.01217 17.4683 2.77248C16.9335 2.5 16.2335 2.5 14.8333 2.5H6.16666C4.76652 2.5 4.06646 2.5 3.53168 2.77248C3.06127 3.01217 2.67882 3.39462 2.43914 3.86502C2.16666 4.3998 2.16666 5.09987 2.16666 6.5V10.1667C2.16666 11.5668 2.16666 12.2669 2.43914 12.8016C2.67882 13.272 3.06127 13.6545 3.53168 13.8942C4.06646 14.1667 4.76652 14.1667 6.16666 14.1667Z" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"></path></svg></label>
                </div>
                <div class="segment transform-scale ">
                    <input type="radio" id="Tablet" name="template-preivew-group" value="768px">
                    <label for="Tablet"><svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 14.5834H10.5083M6.50001 18.3334H14.5C15.4334 18.3334 15.9001 18.3334 16.2567 18.1517C16.5703 17.9919 16.8252 17.7369 16.985 17.4233C17.1667 17.0668 17.1667 16.6001 17.1667 15.6667V4.33335C17.1667 3.39993 17.1667 2.93322 16.985 2.5767C16.8252 2.2631 16.5703 2.00813 16.2567 1.84834C15.9001 1.66669 15.4334 1.66669 14.5 1.66669H6.50001C5.56659 1.66669 5.09988 1.66669 4.74336 1.84834C4.42976 2.00813 4.17479 2.2631 4.015 2.5767C3.83334 2.93322 3.83334 3.39993 3.83334 4.33335V15.6667C3.83334 16.6001 3.83334 17.0668 4.015 17.4233C4.17479 17.7369 4.42976 17.9919 4.74336 18.1517C5.09988 18.3334 5.56659 18.3334 6.50001 18.3334ZM10.9167 14.5834C10.9167 14.8135 10.7301 15 10.5 15C10.2699 15 10.0833 14.8135 10.0833 14.5834C10.0833 14.3532 10.2699 14.1667 10.5 14.1667C10.7301 14.1667 10.9167 14.3532 10.9167 14.5834Z" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"></path></svg></label>
                </div>
                <div class="segment transform-scale ">
                    <input type="radio" id="Mobile" name="template-preivew-group" value="500px">
                    <label for="Mobile"><svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 14.4H10.5071M7.78571 18H13.2143C14.0144 18 14.4144 18 14.72 17.8256C14.9888 17.6722 15.2073 17.4274 15.3443 17.1264C15.5 16.7841 15.5 16.3361 15.5 15.44V4.56C15.5 3.66392 15.5 3.21587 15.3443 2.87362C15.2073 2.57256 14.9888 2.32779 14.72 2.17439C14.4144 2 14.0144 2 13.2143 2H7.78571C6.98564 2 6.5856 2 6.28001 2.17439C6.01121 2.32779 5.79267 2.57256 5.6557 2.87362C5.5 3.21587 5.5 3.66392 5.5 4.56V15.44C5.5 16.3361 5.5 16.7841 5.6557 17.1264C5.79267 17.4274 6.01121 17.6722 6.28001 17.8256C6.5856 18 6.98564 18 7.78571 18ZM10.8571 14.4C10.8571 14.6209 10.6972 14.8 10.5 14.8C10.3028 14.8 10.1429 14.6209 10.1429 14.4C10.1429 14.1791 10.3028 14 10.5 14C10.6972 14 10.8571 14.1791 10.8571 14.4Z" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"></path></svg></label>
                </div>
            </div>
        </div>
        `)
    }

    function getDemoListValue(elementorPreview) {
        elementorPreview.off('change', '.demo-list_dropdown');
        elementorPreview.on('change', '.demo-list_dropdown', function () {
            let value = $(this).val();
            displayTemplates(elementorPreview, value)
        });
    }

    function implementTemplatesImport() {
        const elementorPreview = window.elementor.$previewContents;
        addLibraryButton(elementorPreview);
        getTemplatesModal(elementorPreview);
    }


    function init() {
        if (!window.elementor) return;
        window.elementor.on('preview:loaded', implementTemplatesImport);
    }

    $(window).on('elementor:init', init);

}(jQuery));
