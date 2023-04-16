const ExporterConstants = {
    DOCUMENT_VERSION: "docVersion",
    DOCUMENT_VERSION_PLACEHOLDER: "V_V_V"
}

function buildMainHTML_NavigationIcons(options)
{
    return `
    <div class="containerSVG">
        <svg class="uiIcon">
            <symbol ID="sv-AL-AUTO-HORIZONTAL-MAX" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="matrix(0 1 1 0 11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 11 27)" fill="#D9D9D9" />
                <rect width="4" height="10" rx="1" transform="matrix(-1 0 0 1 14 42)" fill="#007BE5" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 27 27)" fill="#D9D9D9" />
                <rect width="4" height="16" rx="1" transform="matrix(-1 0 0 1 30 36)" fill="#007BE5" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 43 27)" fill="#D9D9D9" />
                <rect width="4" height="8" rx="1" transform="matrix(-1 0 0 1 46 44)" fill="#007BE5" />
                <rect x="0.5" y="0.5" width="55" height="55" transform="matrix(0 1 1 0 0 0)" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-AUTO-HORIZONTAL-CENTER" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="matrix(0 -1 1 0 11 45)" fill="#D9D9D9" />
                <rect x="14" y="33" width="4" height="10" rx="1" transform="rotate(-180 14 33)" fill="#007BE5" />
                <rect width="2" height="2" transform="matrix(0 -1 1 0 11 13)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="matrix(0 -1 1 0 27 45)" fill="#D9D9D9" />
                <rect x="30" y="36" width="4" height="16" rx="1" transform="rotate(-180 30 36)" fill="#007BE5" />
                <rect width="2" height="2" transform="matrix(0 -1 1 0 27 13)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="matrix(0 -1 1 0 43 45)" fill="#D9D9D9" />
                <rect x="46" y="32" width="4" height="8" rx="1" transform="rotate(-180 46 32)" fill="#007BE5" />
                <rect width="2" height="2" transform="matrix(0 -1 1 0 43 13)" fill="#D9D9D9" />
                <rect x="0.5" y="55.5" width="55" height="55" transform="rotate(-90 0.5 55.5)" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-AUTO-HORIZONTAL-MIN" viewBox="0 0 56 56" fill="none">
                <g clip-path="url(#clip0_111_1048)">
                    <rect width="4" height="10" rx="1" transform="matrix(-1 0 0 1 14 4)" fill="#007BE5" />
                </g>
                <rect width="2" height="2" transform="matrix(0 1 1 0 11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 11 43)" fill="#D9D9D9" />
                <rect width="4" height="16" rx="1" transform="matrix(-1 0 0 1 30 4)" fill="#007BE5" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 27 43)" fill="#D9D9D9" />
                <rect width="4" height="8" rx="1" transform="matrix(-1 0 0 1 46 4)" fill="#007BE5" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="matrix(0 1 1 0 43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" transform="matrix(0 1 1 0 0 0)" stroke="#E6E6E6" />
                <defs>
                    <clipPath id="clip0_111_1048">
                        <rect width="16" height="16" rx="1" transform="matrix(-1 0 0 1 20 4)" fill="white" />
                    </clipPath>
                </defs>
            </symbol>
            <symbol ID="sv-AL-AUTO-VERTICAL-MIN" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect x="42" y="14" width="4" height="10" rx="1" transform="rotate(-90 42 14)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect x="36" y="30" width="4" height="16" rx="1" transform="rotate(-90 36 30)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect x="44" y="46" width="4" height="8" rx="1" transform="rotate(-90 44 46)" fill="#007BE5" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-AUTO-VERTICAL-CENTER" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect x="23" y="14" width="4" height="10" rx="1" transform="rotate(-90 23 14)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect x="20" y="30" width="4" height="16" rx="1" transform="rotate(-90 20 30)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect x="24" y="46" width="4" height="8" rx="1" transform="rotate(-90 24 46)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-AUTO-VERTICAL-MAX" viewBox="0 0 56 56" fill="none">
                <rect x="4" y="14" width="4" height="10" rx="1" transform="rotate(-90 4 14)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect x="4" y="30" width="4" height="16" rx="1" transform="rotate(-90 4 30)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect x="4" y="46" width="4" height="8" rx="1" transform="rotate(-90 4 46)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <!-- VERTICAL MAX -->
            <symbol ID="sv-AL-VERTICAL-MAXCENTER" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="matrix(0 1 -1 0 31 39)" fill="#007BE5" />
                <rect width="2" height="10" transform="matrix(0 1 -1 0 33 43)" fill="#007BE5" />
                <rect width="2" height="4" transform="matrix(0 1 -1 0 30 47)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-VERTICAL-MAXMAX" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="matrix(0 1 -1 0 52 39)" fill="#007BE5" />
                <rect width="2" height="10" transform="matrix(0 1 -1 0 52 43)" fill="#007BE5" />
                <rect width="2" height="4" transform="matrix(0 1 -1 0 52 47)" fill="#007BE5" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-VERTICAL-MAXMIN" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="matrix(0 1 -1 0 10 39)" fill="#007BE5" />
                <rect width="2" height="10" transform="matrix(0 1 -1 0 14 43)" fill="#007BE5" />
                <rect width="2" height="4" transform="matrix(0 1 -1 0 8 47)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <!-- VERTICAL CENTER -->
            <symbol ID="sv-AL-VERTICAL-CENTERMIN" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9"/>
                <rect width="2" height="6" transform="matrix(0 1 -1 0 10 23)" fill="#007BE5"/>
                <rect width="2" height="10" transform="matrix(0 1 -1 0 14 27)" fill="#007BE5"/>
                <rect width="2" height="4" transform="matrix(0 1 -1 0 8 31)" fill="#007BE5"/>
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9"/>
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6"/>
            </symbol>
            <symbol ID="sv-AL-VERTICAL-CENTERCENTER" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="matrix(0 1 -1 0 31 23)" fill="#007BE5" />
                <rect width="2" height="10" transform="matrix(0 1 -1 0 33 27)" fill="#007BE5" />
                <rect width="2" height="4" transform="matrix(0 1 -1 0 30 31)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
                <symbol ID="sv-AL-VERTICAL-CENTERMAX" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9"/>
                <rect width="2" height="6" transform="matrix(0 1 -1 0 52 23)" fill="#007BE5"/>
                <rect width="2" height="10" transform="matrix(0 1 -1 0 52 27)" fill="#007BE5"/>
                <rect width="2" height="4" transform="matrix(0 1 -1 0 52 31)" fill="#007BE5"/>
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9"/>
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9"/>
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6"/>            
            </symbol>
            <!-- VERTICAL MIN-->
            <symbol ID="sv-AL-VERTICAL-MINMAX" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="matrix(0 1 -1 0 52 7)" fill="#007BE5" />
                <rect width="2" height="10" transform="matrix(0 1 -1 0 52 11)" fill="#007BE5" />
                <rect width="2" height="4" transform="matrix(0 1 -1 0 52 15)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-VERTICAL-MINMIN" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="4" transform="matrix(0 -1 1 0 26 17)" fill="#007BE5" />
                <rect width="2" height="10" transform="matrix(0 -1 1 0 23 13)" fill="#007BE5" />
                <rect width="2" height="6" transform="matrix(0 -1 1 0 25 9)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-VERTICAL-MINCENTER" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="matrix(0 1 -1 0 10 23)" fill="#007BE5" />
                <rect width="2" height="10" transform="matrix(0 1 -1 0 14 27)" fill="#007BE5" />
                <rect width="2" height="4" transform="matrix(0 1 -1 0 8 31)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <!-- HORIZONTAL -->
            <symbol ID="sv-AL-HORIZONTAL-MAXCENTER" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="translate(23 46)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(27 42)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(31 48)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-HORIZONTAL-MAXMAX" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="translate(39 46)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(43 42)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(47 48)" fill="#007BE5" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-HORIZONTAL-MAXMIN" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="translate(7 46)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(11 42)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(15 48)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-HORIZONTAL-CENTERMIN" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="translate(7 25)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(11 23)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(15 26)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-HORIZONTAL-CENTERCENTER" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="translate(23 25)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(27 23)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(31 26)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-HORIZONTAL-CENTERMAX" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="translate(39 25)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(43 23)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(47 26)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />

            </symbol>
            <symbol ID="sv-AL-HORIZONTAL-MINMIN" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="6" transform="translate(7 4)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(11 4)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(15 4)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />

            </symbol>
            <symbol ID="sv-AL-HORIZONTAL-MINMAX" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 11)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="translate(39 4)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(43 4)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(47 4)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="sv-AL-HORIZONTAL-MINCENTER" viewBox="0 0 56 56" fill="none">
                <rect width="2" height="2" transform="translate(11 11)" fill="#D9D9D9" />
                <rect width="2" height="6" transform="translate(23 4)" fill="#007BE5" />
                <rect width="2" height="10" transform="translate(27 4)" fill="#007BE5" />
                <rect width="2" height="4" transform="translate(31 4)" fill="#007BE5" />
                <rect width="2" height="2" transform="translate(43 11)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 27)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(11 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(27 43)" fill="#D9D9D9" />
                <rect width="2" height="2" transform="translate(43 43)" fill="#D9D9D9" />
                <rect x="0.5" y="0.5" width="55" height="55" stroke="#E6E6E6" />
            </symbol>
            <symbol ID="svRight" viewBox="0 0 20 20">
                <path d="M14.3536 8.35355C14.5488 8.15829 14.5488 7.84171 14.3536 7.64645L11.1716 4.46447C10.9763 4.2692 10.6597 4.2692 10.4645 4.46447C10.2692 4.65973 10.2692 4.97631 10.4645 5.17157L13.2929 8L10.4645 10.8284C10.2692 11.0237 10.2692 11.3403 10.4645 11.5355C10.6597 11.7308 10.9763 11.7308 11.1716 11.5355L14.3536 8.35355ZM14 7.5L2 7.5V8.5L14 8.5V7.5Z" fill="#191919" />
            </symbol>
            <symbol ID="svDown" viewBox="0 0 20 20">
                <path d="M7.64645 14.3536C7.84171 14.5488 8.15829 14.5488 8.35355 14.3536L11.5355 11.1716C11.7308 10.9763 11.7308 10.6597 11.5355 10.4645C11.3403 10.2692 11.0237 10.2692 10.8284 10.4645L8 13.2929L5.17157 10.4645C4.97631 10.2692 4.65973 10.2692 4.46447 10.4645C4.2692 10.6597 4.2692 10.9763 4.46447 11.1716L7.64645 14.3536ZM8.5 14V2H7.5L7.5 14H8.5Z" fill="#191919" />
            </symbol>
            <symbol ID="svItemsSpaceV" viewBox="0 0 16 16" fill="none">
                <path d="M2.24624 2V4M13.7509 2V4M2 4H14" stroke="#7F7F7F" />
                <path d="M5 8H11" stroke="#7F7F7F" />
                <path d="M2.24404 12.0037V14M13.8147 12V14M2 12.1273L14 12.1273" stroke="#7F7F7F" />
            </symbol>
            <symbol ID="svItemsSpaceH" viewBox="0 0 16 16" fill="none">
                <path d="M2 13.7538H4M2 2.24909H4M4 14V2" stroke="#7F7F7F" />
                <path d="M8 11V5" stroke="#7F7F7F" />
                <path d="M12.0037 13.756H14M12 2.18528H14M12.1273 14L12.1273 2" stroke="#7F7F7F" />
            </symbol>
            <symbol ID="PaddingH" viewBox="0 0 16 16" fill="none">
                <path d="M2 14L2 2" stroke="#7F7F7F" />
                <rect x="5.5" y="5.5" width="5" height="5" stroke="#7F7F7F" />
                <path d="M14 14V2" stroke="#7F7F7F" />
            </symbol>
            <symbol ID="PaddingV" viewBox="0 0 16 16" fill="none">
                <path d="M2 2H14" stroke="#7F7F7F" />
                <rect x="5.5" y="5.5" width="5" height="5" stroke="#7F7F7F" />
                <path d="M2 14H14" stroke="#7F7F7F" />
            </symbol>
            <symbol ID="PaddingVT" viewBox="0 0 16 16" fill="none">
                <path d="M2 2H14" stroke="#7F7F7F" />
                <rect x="5.5" y="5.5" width="5" height="5" stroke="#7F7F7F" />
            </symbol>
            <symbol ID="PaddingVB" viewBox="0 0 16 16" fill="none">
                <rect x="5.5" y="5.5" width="5" height="5" stroke="#7F7F7F" />
                <path d="M2 14H14" stroke="#7F7F7F" />
            </symbol>
            <symbol ID="PaddingHR" viewBox="0 0 16 16" fill="none">
                <rect x="10.5" y="5.5" width="5" height="5" transform="rotate(90 10.5 5.5)" stroke="#7F7F7F" />
                <path d="M14 14V2" stroke="#7F7F7F" />
            </symbol>
            <symbol ID="PaddingHL" viewBox="0 0 16 16" fill="none">
                <path d="M2 14L2 2" stroke="#7F7F7F" />
                <rect x="10.5" y="5.5" width="5" height="5" transform="rotate(90 10.5 5.5)" stroke="#7F7F7F" />
            </symbol>
        </svg>
        <svg class="svgIcon">
            <symbol ID="icMenu" viewBox="0 0 24 24">
                <path d="M4,14 C2.8954305,14 2,13.1045695 2,12 C2,10.8954305 2.8954305,10 4,10 C5.1045695,10 6,10.8954305 6,12 C6,13.1045695 5.1045695,14 4,14 Z M12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 Z M20,14 C18.8954305,14 18,13.1045695 18,12 C18,10.8954305 18.8954305,10 20,10 C21.1045695,10 22,10.8954305 22,12 C22,13.1045695 21.1045695,14 20,14 Z" />
            </symbol>
            <symbol ID="icArrwLeft" viewBox="0 0 24 24">
                <path d="M14.7071068,16.2928932 C15.0976311,16.6834175 15.0976311,17.3165825 14.7071068,17.7071068 C14.3165825,18.0976311 13.6834175,18.0976311 13.2928932,17.7071068 L8.29289322,12.7071068 C7.90236893,12.3165825 7.90236893,11.6834175 8.29289322,11.2928932 L13.2928932,6.29289322 C13.6834175,5.90236893 14.3165825,5.90236893 14.7071068,6.29289322 C15.0976311,6.68341751 15.0976311,7.31658249 14.7071068,7.70710678 L10.4142136,12 L14.7071068,16.2928932 Z" />
            </symbol>
            <symbol ID="icArrwRight" viewBox="0 0 24 24">
                <path d="M15.7071068,16.2928932 C16.0976311,16.6834175 16.0976311,17.3165825 15.7071068,17.7071068 C15.3165825,18.0976311 14.6834175,18.0976311 14.2928932,17.7071068 L9.29289322,12.7071068 C8.90236893,12.3165825 8.90236893,11.6834175 9.29289322,11.2928932 L14.2928932,6.29289322 C14.6834175,5.90236893 15.3165825,5.90236893 15.7071068,6.29289322 C16.0976311,6.68341751 16.0976311,7.31658249 15.7071068,7.70710678 L11.4142136,12 L15.7071068,16.2928932 Z" transform="matrix(-1 0 0 1 25 0)" />
            </symbol>
            <symbol ID="icHeart" viewBox="0 0 24 24">
                <path fill="none" stroke="#404B58" stroke-width="2" d="M12,18.8536369 C17.3943819,16.1015046 20,12.9784118 20,9.5 C20,7.01471863 17.9852814,5 15.5,5 C14.4391705,5 13.4374107,5.36699819 12.6367778,6.02820949 L12,6.55409926 L11.3632222,6.02820949 C10.5625893,5.36699819 9.56082953,5 8.5,5 C6.01471863,5 4,7.01471863 4,9.5 C4,12.9784118 6.60561807,16.1015046 12,18.8536369 Z" />
            </symbol>
            <symbol ID="icPointer" viewBox="0 0 24 24">
                <path d="M7.16743376,4.34579076 C7.66363057,3.87908025 8.39151976,3.755899 9.01365224,4.03335379 L9.01365224,4.03335379 L9.10700534,4.08777143 C9.63104823,4.47472439 10.0217699,5.01508408 10.2127512,5.60062907 C10.4917675,6.2824399 10.6779761,6.99862675 10.7637203,7.71100475 L10.7637203,7.71100475 L10.817,8.033 L10.870648,7.99008307 C10.9508584,7.93108653 11.0375587,7.87866583 11.130137,7.83371233 L11.130137,7.83371233 L11.2733366,7.7719939 C11.645598,7.65777539 12.0393934,7.63209308 12.4423174,7.7005808 C12.8744158,7.79091478 13.2571639,8.03945252 13.515467,8.3974312 L13.515467,8.3974312 L13.525,8.415 L13.5580532,8.38060854 C13.7375777,8.20417748 13.9573664,8.06689595 14.2126677,7.97661745 L14.2126677,7.97661745 L14.3700719,7.92815354 C14.7601243,7.85683728 15.1598757,7.85683728 15.6185326,7.94579813 C15.9857599,8.06856757 16.3070009,8.30005011 16.5396674,8.609557 L16.5396674,8.609557 L16.6043493,8.72458234 C16.6428414,8.82097976 16.6788016,8.91827539 16.7122125,9.01653061 L16.7122125,9.01653061 L16.726,9.06 L16.8208864,8.97721759 C16.9681747,8.85926223 17.1379522,8.76879133 17.3224355,8.71266304 L17.3224355,8.71266304 L17.4634337,8.67711323 C17.9896455,8.5711603 18.5324104,8.75398638 18.8872742,9.15672267 C19.242138,9.55945895 19.3551885,10.1209202 19.1838405,10.6296094 L19.2093224,10.5357799 L19.2090334,12.7610745 C19.1862391,13.1271355 19.1470105,13.4918634 19.0880685,13.8664949 L19.0224339,14.2448438 L18.9429284,14.6322922 C18.7541803,15.1823144 18.4914657,15.7040948 18.1217893,16.2343243 C17.6699093,16.7368429 17.2965379,17.3047439 17.0143136,17.9188042 L17.0363224,17.8727799 L17.0047955,18.0384429 C16.9929046,18.1111666 16.9833046,18.1844595 16.9760091,18.2584435 L16.9610493,18.4825906 L16.9599974,18.7116152 C16.9591372,18.9778721 16.9937268,19.2430586 17.0628545,19.5001867 C17.1426598,19.7970308 16.9382454,20.0949145 16.6325641,20.1272293 C16.1887579,20.1741459 15.7412421,20.1741459 15.2739714,20.1241858 C14.8192803,20.0542334 14.4188874,19.6281882 14.0808095,19.0818271 L14.0808095,19.0818271 L14.007,18.959 C13.6458971,19.5469161 13.2283691,20.0164429 12.7971825,20.133474 L12.7971825,20.133474 L12.6792804,20.1564734 C12.40804,20.1888603 12.1178623,20.1996559 11.5976025,20.1951344 L11.5976025,20.1951344 L10.2584286,20.169736 L9.48,20.16 C9.16840558,20.16 8.93270845,19.8780895 8.98790834,19.5714235 L8.98790834,19.5714235 L9.0027436,19.4616806 C9.02119919,19.2959265 9.02585489,19.1230993 9.00917907,18.9708257 C8.99125835,18.8071844 8.95160807,18.7033862 8.92009941,18.6757201 L8.92009941,18.6757201 L8.68126124,18.4610804 L7.73371165,17.5692523 L6.87532389,16.5869703 C6.7408966,16.4141352 6.12289613,15.3607699 5.76460288,14.7906072 L5.76460288,14.7906072 L5.62038404,14.5667312 C5.59696768,14.5332792 5.57867016,14.5070634 5.55981671,14.4808928 L5.55981671,14.4808928 L4.6386181,13.3268316 C4.38383819,13.0013876 4.22702059,12.7785585 4.13684781,12.6063498 L4.13684781,12.6063498 L4.05648317,12.4645383 C3.86064293,12.0784209 3.81297141,11.6326253 3.92414472,11.2219126 C4.14055922,10.3315035 4.98520633,9.74084121 5.93847381,9.84979299 C6.54529028,9.97169156 7.1029491,10.2691096 7.53281665,10.6960265 L7.53281665,10.6960265 L7.723,10.883 L7.6912417,10.723928 L7.64251772,10.5011802 C7.57779705,10.2174049 7.53759574,10.0512485 7.49682897,9.89744992 L7.49682897,9.89744992 L7.32963781,9.29184575 L7.04456938,8.13982119 C6.92154004,7.6413934 6.82477772,7.13684703 6.75976794,6.65834902 C6.61137215,5.91865308 6.7193326,5.15047299 7.06586723,4.48033484 L7.06586723,4.48033484 Z M8.50934031,4.91178804 C8.27952269,4.84813061 8.02983182,4.9074776 7.85256624,5.07420924 L7.91432244,5.02377994 L7.87117294,5.11837118 C7.74604513,5.42118721 7.68689523,5.74791709 7.69799852,6.08431903 L7.71312508,6.28720691 L7.81882079,6.96398474 C7.87322009,7.27747387 7.93828923,7.58776101 8.01328078,7.89178265 L8.01328078,7.89178265 L8.29601637,9.03471155 L8.44911047,9.58764732 L8.58001699,10.1158847 L8.67625156,10.548595 C8.75149962,10.9085229 8.81587907,11.2760953 8.87882633,11.6904775 L8.87882633,11.6904775 L8.97335261,12.3520537 C9.01060121,12.4927706 9.0255715,12.5703226 9.01950838,12.6680061 C9.00562698,12.8916511 9.00162999,12.9288159 8.65656558,13.0620472 L8.65656558,13.0620472 L8.43241435,13.1459443 C8.23545672,13.065262 8.18621731,13.0450914 8.15393215,13.0140564 L8.15393215,13.0140564 L8.08883861,12.9370646 L7.80233685,12.5590928 L7.5578657,12.2238297 L7.29668723,11.8970782 C7.15496439,11.7304554 7.00269692,11.5703689 6.83776679,11.4148687 C6.53749664,11.1168285 6.15631213,10.9135301 5.78418862,10.8368753 C5.37391601,10.7907916 4.99336072,11.0569141 4.892676,11.4704756 C4.83729564,11.6753474 4.87010001,11.8940432 5.00167451,12.1056421 L5.00167451,12.1056421 L5.03690334,12.1679323 C5.11596703,12.3004962 5.24732182,12.482014 5.44275702,12.7314353 L5.44275702,12.7314353 L5.92017745,13.3249945 L6.29953254,13.8026386 L6.44532166,14.0015976 C6.74304028,14.4457352 7.37243772,15.5180187 7.58358848,15.8552149 L7.58358848,15.8552149 L7.64628835,15.9507477 L8.44514313,16.8689487 L9.35653146,17.7235091 L9.57990059,17.9242799 C9.83717242,18.1501771 9.96070027,18.4735533 10.003236,18.8619643 C10.0118351,18.9404865 10.0168432,19.0197358 10.0187392,19.0991214 L10.0187392,19.0991214 L10.017,19.165 L11.2459156,19.1902367 C11.83561,19.2002217 12.1681116,19.1973958 12.4192519,19.177468 L12.4192519,19.177468 L12.5615794,19.1634247 C12.6170658,19.1568969 13.0000528,18.7092498 13.2226316,18.3267031 L13.2226316,18.3267031 L13.2778839,18.2314035 C13.4396915,17.9886975 13.7135208,17.8397056 14.01,17.8397056 C14.3435391,17.8397056 14.648412,18.0282734 14.789646,18.3118584 L14.789646,18.3118584 L14.8465822,18.411971 C15.047575,18.7505088 15.3490101,19.1240166 15.4025641,19.1327707 C15.5895219,19.1525347 15.7772609,19.1624167 15.965,19.1624167 L15.965,19.1624167 L15.985,19.161 L15.9680577,18.9804543 L15.9601727,18.7231423 C15.9502275,18.3449039 15.9880257,17.9669214 16.0726727,17.5981423 L16.0726727,17.5981423 L16.1056864,17.5011958 C16.429971,16.7956214 16.8589864,16.1430854 17.3379853,15.6167264 C17.61604,15.2123026 17.8377695,14.7719231 17.981188,14.3648199 C18.099272,13.8160386 18.1760798,13.2591823 18.21,12.73 L18.21,12.73 L18.21,10.47 L18.2361595,10.3103906 C18.2934615,10.1402752 18.2556553,9.95251178 18.136982,9.81782907 C18.0183088,9.68314635 17.8367978,9.62200582 17.6608226,9.6574385 C17.4848473,9.69287119 17.3411425,9.81949403 17.2838405,9.98960943 L17.2838405,9.98960943 L17.2333183,10.0960858 C17.2060315,10.1394966 17.1784846,10.1946376 17.1518918,10.2591212 C17.1098746,10.3610069 17.0769839,10.4664928 17.0409555,10.6029732 L17.0409555,10.6029732 L16.996796,10.7581274 L16.9595346,10.8379862 C16.9006729,10.9958359 16.8849765,11.0379292 16.5932412,10.9992882 L16.5932412,10.9992882 L16.1501329,10.9267917 C16.0348274,10.6676813 16.009204,10.6101012 16.0212304,10.6050553 C15.9848193,10.0869965 15.8682391,9.57772504 15.6756507,9.09541766 L15.7,9.162 L15.6694688,9.12668516 C15.5949633,9.04790444 15.511666,8.98482947 15.4387784,8.94442971 L15.4387784,8.94442971 L15.3700719,8.91184646 C15.098938,8.86227297 14.821062,8.86227297 14.5895196,8.90293341 C14.4230985,8.94756646 14.2774688,9.04887406 14.1777454,9.18938502 L14.2223224,9.13377994 L14.1675121,9.33868789 C14.1182734,9.53586776 14.0787072,9.73525859 14.0489695,9.93588797 L14.011754,10.2376394 L13.9893984,10.5405193 C13.9584597,11.1706655 13.0294935,11.1762842 12.9909347,10.5465584 L12.9909347,10.5465584 L12.9730784,10.2516986 C12.930789,9.77937294 12.8204225,9.3155109 12.6453027,8.87454375 L12.669,8.94 L12.6310282,8.89504189 C12.5518534,8.81362497 12.456908,8.75113321 12.3573482,8.71292346 L12.3573482,8.71292346 L12.2566634,8.6830061 C12.0262976,8.64406561 11.7900203,8.659475 11.5981215,8.71719666 C11.4132489,8.78768046 11.2781507,8.94899175 11.2402903,9.14805807 C11.2189407,9.25480644 11.2137839,9.47449295 11.224132,9.79681583 L11.224132,9.79681583 L11.25,10.55 C11.25,11.2056512 10.2721205,11.2219446 10.2502775,10.5666574 C10.2493885,10.539987 10.2483981,10.5176836 10.244244,10.482217 L10.244244,10.482217 L9.90052097,8.58822404 L9.77361364,7.85000483 C9.69594584,7.20750256 9.53236284,6.57833719 9.27496435,5.94601645 L9.27496435,5.94601645 L9.20787946,5.76867193 C9.05849627,5.42113224 8.81912344,5.11827389 8.51299466,4.89222857 L8.51732244,4.89577994 L8.557,4.928 Z M15.375,13 C15.5562184,13 15.707414,13.1282379 15.7423813,13.2987132 L15.75,13.3741092 L15.75,16.8258906 C15.75,17.0325054 15.5821068,17.1999998 15.375,17.1999998 C15.1937816,17.1999998 15.042586,17.0717619 15.0076187,16.9012866 L15,16.8258906 L15,13.3741092 C15,13.1674944 15.1678932,13 15.375,13 Z M13.3728388,13 C13.5540542,12.998966 13.7059881,13.1260313 13.7419398,13.2958993 L13.7499939,13.3710717 L13.7699939,16.8246259 C13.7711876,17.0307477 13.6042648,17.1988055 13.3971615,17.1999998 C13.2159461,17.2010338 13.0640121,17.0739685 13.0280605,16.9041005 L13.0200064,16.8289281 L13,13.3753739 C12.9988127,13.1692522 13.1657354,13.0011944 13.3728388,13 Z M11.3728136,13 C11.5540289,12.998944 11.7059714,13.127215 11.7419346,13.2987061 L11.7499938,13.3745973 L11.7699938,16.8210084 C11.7712014,17.0291026 11.6042899,17.1987799 11.3971867,17.1999998 C11.2159713,17.2010558 11.0640288,17.0727848 11.0280657,16.9012937 L11.0200065,16.8254025 L11,13.3789914 C10.9987989,13.1708972 11.1657103,13.0012199 11.3728136,13 Z" />
            </symbol>
            <symbol ID="icAnnotation" viewBox="0 0 24 24">
                <path d="M5,16 L13,16 C13.5522847,16 14,16.4477153 14,17 C14,17.5522847 13.5522847,18 13,18 L5,18 C4.44771525,18 4,17.5522847 4,17 C4,16.4477153 4.44771525,16 5,16 Z M5,6 L19,6 C19.5522847,6 20,6.44771525 20,7 C20,7.55228475 19.5522847,8 19,8 L5,8 C4.44771525,8 4,7.55228475 4,7 C4,6.44771525 4.44771525,6 5,6 Z M5,11 L19,11 C19.5522847,11 20,11.4477153 20,12 C20,12.5522847 19.5522847,13 19,13 L5,13 C4.44771525,13 4,12.5522847 4,12 C4,11.4477153 4.44771525,11 5,11 Z" />
            </symbol>
            <symbol ID="icExperimental" viewBox="0 0 24 24">
                <path fill="white" d="M16,3 C16.5522847,3 17,3.44771525 17,4 C17,4.55228475 16.5522847,5 16,5 L14.9999117,5 L15,10.667 L20.2,17.6 C20.3622777,17.8163702 20.4624259,18.0717378 20.4913009,18.3386714 L20.4913009,18.3386714 L20.5,18.5 C20.5,19.3284271 19.8284271,20 19,20 L19,20 L5,20 C4.67544468,20 4.35964426,19.8947332 4.1,19.7 C3.4372583,19.2029437 3.30294373,18.2627417 3.8,17.6 L3.8,17.6 L9,10.667 L8.99991172,5 L8,5 C7.44771525,5 7,4.55228475 7,4 C7,3.44771525 7.44771525,3 8,3 L16,3 Z M13,5 L11,5 L11,11.3333333 L5.999,18 L17.999,18 L13,11.3333333 L13,5 Z" />
            </symbol>
            <symbol ID="icEmbed" viewBox="0 0 24 24">
                <path d="M6.7080808,14.2938686 C7.09806642,14.6849308 7.09719364,15.3180952 6.70613141,15.7080808 C6.31506919,16.0980664 5.68190481,16.0971936 5.2919192,15.7061314 L2.2919192,12.6978494 C1.90193253,12.3067862 1.90280651,11.6736197 2.29387128,11.2836345 L5.29387128,8.29191651 C5.684935,7.90193238 6.31809937,7.90280757 6.70808349,8.29387128 C7.09806762,8.684935 7.09719243,9.31809937 6.70612872,9.70808349 L4.41421491,11.9936701 L6.7080808,14.2938686 Z M17.2938713,9.70808349 C16.9028076,9.31809937 16.9019324,8.684935 17.2919165,8.29387128 C17.6819006,7.90280757 18.315065,7.90193238 18.7061287,8.29191651 L21.7061287,11.2836345 C22.0971935,11.6736197 22.0980675,12.3067862 21.7080808,12.6978494 L18.7080808,15.7061314 C18.3180952,16.0971936 17.6849308,16.0980664 17.2938686,15.7080808 C16.9028064,15.3180952 16.9019336,14.6849308 17.2919192,14.2938686 L19.5857851,11.9936701 L17.2938713,9.70808349 Z M13.0513167,5.68377223 C13.2259645,5.15982892 13.7922844,4.87666893 14.3162278,5.0513167 C14.8401711,5.22596447 15.1233311,5.79228445 14.9486833,6.31622777 L10.9486833,18.3162278 C10.7740355,18.8401711 10.2077156,19.1233311 9.68377223,18.9486833 C9.15982892,18.7740355 8.87666893,18.2077156 9.0513167,17.6837722 L13.0513167,5.68377223 Z" />
            </symbol>
            <symbol ID="icGrid" viewBox="0 0 24 24">
                <path d="M12,17 C13.1045695,17 14,17.8954305 14,19 C14,20.1045695 13.1045695,21 12,21 C10.8954305,21 10,20.1045695 10,19 C10,17.8954305 10.8954305,17 12,17 Z M18.5,17 C19.3284271,17 20,17.6715729 20,18.5 C20,19.3284271 19.3284271,20 18.5,20 C17.6715729,20 17,19.3284271 17,18.5 C17,17.6715729 17.6715729,17 18.5,17 Z M5.5,17 C6.32842712,17 7,17.6715729 7,18.5 C7,19.3284271 6.32842712,20 5.5,20 C4.67157288,20 4,19.3284271 4,18.5 C4,17.6715729 4.67157288,17 5.5,17 Z M12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 Z M19,10 C20.1045695,10 21,10.8954305 21,12 C21,13.1045695 20.1045695,14 19,14 C17.8954305,14 17,13.1045695 17,12 C17,10.8954305 17.8954305,10 19,10 Z M5,10 C6.1045695,10 7,10.8954305 7,12 C7,13.1045695 6.1045695,14 5,14 C3.8954305,14 3,13.1045695 3,12 C3,10.8954305 3.8954305,10 5,10 Z M12,3 C13.1045695,3 14,3.8954305 14,5 C14,6.1045695 13.1045695,7 12,7 C10.8954305,7 10,6.1045695 10,5 C10,3.8954305 10.8954305,3 12,3 Z M18.5,4 C19.3284271,4 20,4.67157288 20,5.5 C20,6.32842712 19.3284271,7 18.5,7 C17.6715729,7 17,6.32842712 17,5.5 C17,4.67157288 17.6715729,4 18.5,4 Z M5.5,4 C6.32842712,4 7,4.67157288 7,5.5 C7,6.32842712 6.32842712,7 5.5,7 C4.67157288,7 4,6.32842712 4,5.5 C4,4.67157288 4.67157288,4 5.5,4 Z" />
            </symbol>
            <symbol ID="icClose" viewBox="0 0 24 24">
                <path d="M10.5857864,12 L7.29289322,8.70710678 C6.90236893,8.31658249 6.90236893,7.68341751 7.29289322,7.29289322 C7.68341751,6.90236893 8.31658249,6.90236893 8.70710678,7.29289322 L12,10.5857864 L15.2928932,7.29289322 C15.6834175,6.90236893 16.3165825,6.90236893 16.7071068,7.29289322 C17.0976311,7.68341751 17.0976311,8.31658249 16.7071068,8.70710678 L13.4142136,12 L16.7071068,15.2928932 C17.0976311,15.6834175 17.0976311,16.3165825 16.7071068,16.7071068 C16.3165825,17.0976311 15.6834175,17.0976311 15.2928932,16.7071068 L12,13.4142136 L8.70710678,16.7071068 C8.31658249,17.0976311 7.68341751,17.0976311 7.29289322,16.7071068 C6.90236893,16.3165825 6.90236893,15.6834175 7.29289322,15.2928932 L10.5857864,12 Z" transform="rotate(-90 12 12)" />
            </symbol>
            <symbol ID="icBack" viewBox="0 0 24 24">
                <path d="M8.36500685,12.7725895 C8.14212731,12.5891835 8,12.3112069 8,12.0000346 C8,11.7624738 8.08283717,11.5442607 8.22120202,11.3727048 L8.22132741,11.3368041 L12.2213274,6.37260414 C12.5678477,5.94255515 13.1973815,5.87484175 13.6274305,6.22136203 C14.0574795,6.56788232 14.1251929,7.1974161 13.7786726,7.6274651 L11.0611595,11.0000346 L19,11.0000346 C19.5522847,11.0000346 20,11.4477499 20,12.0000346 C20,12.5523194 19.5522847,13.0000346 19,13.0000346 L11.0998289,13.0000346 L13.7830365,16.3780588 C14.1265442,16.8105179 14.0544349,17.4395633 13.6219758,17.7830711 C13.1895167,18.1265788 12.5604713,18.0544695 12.2169635,17.6220104 L8.36500685,12.7725895 Z M5,6.00003462 C5.55228475,6.00003462 6,6.44774987 6,7.00003462 L6,17.0000346 C6,17.5523194 5.55228475,18.0000346 5,18.0000346 C4.44771525,18.0000346 4,17.5523194 4,17.0000346 L4,7.00003462 C4,6.44774987 4.44771525,6.00003462 5,6.00003462 Z" />
            </symbol>
            <symbol ID="icResize" viewBox="0 0 24 24">
                <path d="M15.5857864,7 L13,7 C12.4477153,7 12,6.55228475 12,6 C12,5.44771525 12.4477153,5 13,5 L18,5 C18.5522847,5 19,5.44771525 19,6 L19,11 C19,11.5522847 18.5522847,12 18,12 C17.4477153,12 17,11.5522847 17,11 L17,8.41421356 L14.7071068,10.7071068 C14.3165825,11.0976311 13.6834175,11.0976311 13.2928932,10.7071068 C12.9023689,10.3165825 12.9023689,9.68341751 13.2928932,9.29289322 L15.5857864,7 Z M7,15.5857864 L9.29289322,13.2928932 C9.68341751,12.9023689 10.3165825,12.9023689 10.7071068,13.2928932 C11.0976311,13.6834175 11.0976311,14.3165825 10.7071068,14.7071068 L8.41421356,17 L11,17 C11.5522847,17 12,17.4477153 12,18 C12,18.5522847 11.5522847,19 11,19 L6,19 C5.44771525,19 5,18.5522847 5,18 L5,13 C5,12.4477153 5.44771525,12 6,12 C6.55228475,12 7,12.4477153 7,13 L7,15.5857864 Z" />
            </symbol>
            <symbol ID="icGridLayout" viewBox="0 0 24 24">
                <path d="M6.07692308,5 C5.48215488,5 5,5.44771525 5,6 L5,17 C5,17.5522847 5.48215488,18 6.07692308,18 L17.9230769,18 C18.5178451,18 19,17.5522847 19,17 L19,6 C19,5.44771525 18.5178451,5 17.9230769,5 L6.07692308,5 Z M6.17647059,3 L17.8235294,3 C19.5778457,3 21,4.34314575 21,6 L21,17 C21,18.6568542 19.5778457,20 17.8235294,20 L6.17647059,20 C4.42215432,20 3,18.6568542 3,17 L3,6 C3,4.34314575 4.42215432,3 6.17647059,3 Z M14,5 L16,5 L16,18 L14,18 L14,5 Z M8,5 L10,5 L10,18 L8,18 L8,5 Z" />
            </symbol>
            <symbol ID="icElementInspector" viewBox="0 0 24 24">
                <path d="M6,5 C5.40294373,5 5,5.41327562 5,6 L5,18 C5,18.5867244 5.40294373,19 6,19 L9,19 L9,5 L6,5 Z M6,3 L9,3 L9,21 L6,21 C4.22104159,21 3,19.7358628 3,18 L3,6 C3,4.26413718 4.22104159,3 6,3 Z M12,1 C12.5522847,1 13,1.44771525 13,2 L13,22 C13,22.5522847 12.5522847,23 12,23 C11.4477153,23 11,22.5522847 11,22 L11,2 C11,1.44771525 11.4477153,1 12,1 Z M15,3 L17,3 L17,5 L15,5 L15,3 Z M19,7 L21,7 L21,9 L19,9 L19,7 Z M19,11 L21,11 L21,13 L19,13 L19,11 Z M19,15 L21,15 L21,17 L19,17 L19,15 Z M15,19 L17,19 L17,21 L15,21 L15,19 Z M19,19 L21,19 C21,20.1045695 20.1045695,21 19,21 L19,19 Z M19,3 C20.1045695,3 21,3.8954305 21,5 L19,5 L19,3 Z" />
            </symbol>
            <symbol ID="icVersionInspector" viewBox="0 0 24 24">
                <path d="M6,5 C5.40294373,5 5,5.41327562 5,6 L5,18 C5,18.5867244 5.40294373,19 6,19 L9,19 L9,5 L6,5 Z M6,3 L9,3 L9,21 L6,21 C4.22104159,21 3,19.7358628 3,18 L3,6 C3,4.26413718 4.22104159,3 6,3 Z M12,1 C12.5522847,1 13,1.44771525 13,2 L13,22 C13,22.5522847 12.5522847,23 12,23 C11.4477153,23 11,22.5522847 11,22 L11,2 C11,1.44771525 11.4477153,1 12,1 Z M15,3 L17,3 L17,5 L15,5 L15,3 Z M19,7 L21,7 L21,9 L19,9 L19,7 Z M19,11 L21,11 L21,13 L19,13 L19,11 Z M19,15 L21,15 L21,17 L19,17 L19,15 Z M15,19 L17,19 L17,21 L15,21 L15,19 Z M19,19 L21,19 C21,20.1045695 20.1045695,21 19,21 L19,19 Z M19,3 C20.1045695,3 21,3.8954305 21,5 L19,5 L19,3 Z" />
            </symbol>
            <symbol ID="icIncreaseVersion" viewBox="0 0 24 24">
                <path d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M11.3086198,9.29124083 C11.7000598,8.90162823 12.333229,8.90311306 12.7228373,9.29455727 L12.7228373,9.29455727 L15.7087669,12.2945573 C16.0983722,12.6859984 16.0968839,13.3191617 15.7054427,13.7087669 C15.3140016,14.0983722 14.6808383,14.0968839 14.2912331,13.7054427 L14.2912331,13.7054427 L12.0107539,11.4142175 L9.70545052,13.7087592 C9.31401364,14.0983687 8.6808504,14.0968874 8.29124083,13.7054505 C7.90163127,13.3140136 7.9031126,12.6808504 8.29454948,12.2912408 L8.29454948,12.2912408 Z" />
            </symbol>
            <symbol ID="icDecreaseVersion" viewBox="0 0 24 24">
                <path d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M8.29124083,10.2945495 C8.6808504,9.9031126 9.31401364,9.90163127 9.70545052,10.2912408 L9.70545052,10.2912408 L12.0107539,12.5857825 L14.2912331,10.2945573 C14.6808383,9.90311611 15.3140016,9.90162781 15.7054427,10.2912331 C16.0968839,10.6808383 16.0983722,11.3140016 15.7087669,11.7054427 L15.7087669,11.7054427 L12.7228373,14.7054427 C12.333229,15.0968869 11.7000598,15.0983718 11.3086198,14.7087592 L11.3086198,14.7087592 L8.29454948,11.7087592 C7.9031126,11.3191496 7.90163127,10.6859864 8.29124083,10.2945495 Z" />
            </symbol>
            <symbol ID="icCloseBtn" viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M4.29289322,4.29289322 C4.68341751,3.90236893 5.31658249,3.90236893 5.70710678,4.29289322 L5.70710678,4.29289322 L12,10.585 L18.2928932,4.29289322 C18.6533772,3.93240926 19.2206082,3.90467972 19.6128994,4.20970461 L19.7071068,4.29289322 C20.0976311,4.68341751 20.0976311,5.31658249 19.7071068,5.70710678 L19.7071068,5.70710678 L13.415,12 L19.7071068,18.2928932 C20.0675907,18.6533772 20.0953203,19.2206082 19.7902954,19.6128994 L19.7071068,19.7071068 C19.3165825,20.0976311 18.6834175,20.0976311 18.2928932,19.7071068 L18.2928932,19.7071068 L12,13.415 L5.70710678,19.7071068 C5.34662282,20.0675907 4.77939176,20.0953203 4.38710056,19.7902954 L4.29289322,19.7071068 C3.90236893,19.3165825 3.90236893,18.6834175 4.29289322,18.2928932 L4.29289322,18.2928932 L10.585,12 L4.29289322,5.70710678 C3.93240926,5.34662282 3.90467972,4.77939176 4.20970461,4.38710056 Z" />
            </symbol>
            <symbol ID="icAddComment" viewBox="0 0 24 24">
                <path d="M19,3 L5,3 C3.34314575,3 2,4.34314575 2,6 L2,16 L2.00509269,16.1762728 C2.09633912,17.75108 3.40231912,19 5,19 L15.65,19 L18.7506099,21.4811128 C19.105236,21.7648136 19.545857,21.9193752 20,21.9193752 C21.1045695,21.9193752 22,21.0239447 22,19.9193752 L22,6 C22,4.34314575 20.6568542,3 19,3 Z M5,5 L19,5 C19.5522847,5 20,5.44771525 20,6 L20,19.9193752 L16.3507811,17 L5,17 C4.44771525,17 4,16.5522847 4,16 L4,6 C4,5.44771525 4.44771525,5 5,5 Z M12,7 C12.5522847,7 13,7.44771525 13,8 L13,14 C13,14.5522847 12.5522847,15 12,15 C11.4477153,15 11,14.5522847 11,14 L11,8 C11,7.44771525 11.4477153,7 12,7 Z M9,10 L15,10 C15.5522847,10 16,10.4477153 16,11 C16,11.5522847 15.5522847,12 15,12 L9,12 C8.44771525,12 8,11.5522847 8,11 C8,10.4477153 8.44771525,10 9,10 Z" />
            </symbol>
            <symbol ID="icComments" viewBox="0 0 24 24">
                <path d="M19,3 C20.6568542,3 22,4.34314575 22,6 L22,6 L22,19.9193752 C22,21.0239447 21.1045695,21.9193752 20,21.9193752 C19.545857,21.9193752 19.105236,21.7648136 18.7506099,21.4811128 L18.7506099,21.4811128 L15.65,19 L5,19 C3.40231912,19 2.09633912,17.75108 2.00509269,16.1762728 L2.00509269,16.1762728 L2,16 L2,6 C2,4.34314575 3.34314575,3 5,3 L5,3 Z M19,5 L5,5 C4.44771525,5 4,5.44771525 4,6 L4,6 L4,16 C4,16.5522847 4.44771525,17 5,17 L5,17 L16.3507811,17 L20,19.9193752 L20,6 C20,5.44771525 19.5522847,5 19,5 L19,5 Z M12,12 C12.5522847,12 13,12.4477153 13,13 C13,13.5522847 12.5522847,14 12,14 L8,14 C7.44771525,14 7,13.5522847 7,13 C7,12.4477153 7.44771525,12 8,12 L12,12 Z M16,8 C16.5522847,8 17,8.44771525 17,9 C17,9.55228475 16.5522847,10 16,10 L8,10 C7.44771525,10 7,9.55228475 7,9 C7,8.44771525 7.44771525,8 8,8 L16,8 Z" />
            </symbol>
            <symbol ID="icHide" viewBox="0 0 24 24">
                <path d="M5.38615132,2.21064778 C5.82209852,1.87157774 6.45037412,1.95011219 6.78944416,2.38605939 L6.78944416,2.38605939 L20.7894442,20.3860594 L20.8603054,20.4898575 C21.1143171,20.9169531 21.0164453,21.4763645 20.6140326,21.7893522 C20.1780854,22.1284223 19.5498098,22.0498878 19.2107397,21.6139406 L19.2107397,21.6139406 L16.8780344,18.6156594 C15.5498874,19.5708529 14.041875,20 12,20 C8.6859351,20 6.77821955,18.8695019 4.76330809,16.1942038 L4.76330809,16.1942038 L4.61751058,15.9953594 L2.63509259,13.1986701 L2.28770167,12.7182294 L1.75,12 L2.2,11.4 L2.49341785,10.9985181 L4.31543313,8.42073233 L4.75555556,7.80740741 C5.42384589,6.91635363 6.0806072,6.19680427 6.78216144,5.63325828 L5.21073972,3.61394061 L5.13987849,3.51014248 C4.88586677,3.08304691 4.98373853,2.52363551 5.38615132,2.21064778 Z M8.00925198,7.2123467 C7.45172452,7.66214724 6.92187523,8.25231451 6.35555556,9.00740741 L6.35555556,9.00740741 L6.30731957,9.07271659 L4.236,11.999 L6.30450475,14.9148846 L6.53802015,15.2223052 C8.12271813,17.2561888 9.46831678,18 12,18 C13.5528699,18 14.6595013,17.7201572 15.6487821,17.0344116 L14.2866626,15.2823731 C13.6385783,15.7347043 12.8502707,16 12,16 C9.790861,16 8,14.209139 8,12 C8,10.7921161 8.535385,9.70927802 9.38179517,8.97584565 Z M12,4 C15.3306702,4 17.2354638,5.12876655 19.2444444,7.80740741 L19.2444444,7.80740741 L19.3777773,7.98990371 L21.2554675,10.6474617 L21.7154062,11.2859885 L22.25,12 L21.7122983,12.7182294 L21.3649074,13.1986701 L19.7160653,15.5283237 L19.623,15.657954 L18.34,14.007954 L19.763,11.999 L17.9370251,9.41365436 L17.6444444,9.00740741 C15.9867584,6.79715938 14.641552,6 12,6 L12.112,6.00095403 L10.6134966,4.07512187 C10.9529438,4.03563361 11.3083548,4.01198764 11.6820769,4.00353786 Z M10,12 C10,13.1045695 10.8954305,14 12,14 C12.3873079,14 12.7489023,13.8899073 13.0551963,13.6993088 L10.6131393,10.5589495 C10.23517,10.9227924 10,11.4339327 10,12 Z" />
            </symbol>
            <symbol ID="icList" viewBox="0 0 24 24">
                <path d="M5,16 C5.55228475,16 6,16.4477153 6,17 C6,17.5522847 5.55228475,18 5,18 L4,18 C3.44771525,18 3,17.5522847 3,17 C3,16.4477153 3.44771525,16 4,16 L5,16 Z M20,16 C20.5522847,16 21,16.4477153 21,17 C21,17.5522847 20.5522847,18 20,18 L10,18 C9.44771525,18 9,17.5522847 9,17 C9,16.4477153 9.44771525,16 10,16 L20,16 Z M5,11 C5.55228475,11 6,11.4477153 6,12 C6,12.5522847 5.55228475,13 5,13 L4,13 C3.44771525,13 3,12.5522847 3,12 C3,11.4477153 3.44771525,11 4,11 L5,11 Z M20,11 C20.5522847,11 21,11.4477153 21,12 C21,12.5522847 20.5522847,13 20,13 L10,13 C9.44771525,13 9,12.5522847 9,12 C9,11.4477153 9.44771525,11 10,11 L20,11 Z M5,6 C5.55228475,6 6,6.44771525 6,7 C6,7.55228475 5.55228475,8 5,8 L4,8 C3.44771525,8 3,7.55228475 3,7 C3,6.44771525 3.44771525,6 4,6 L5,6 Z M20,6 C20.5522847,6 21,6.44771525 21,7 C21,7.55228475 20.5522847,8 20,8 L10,8 C9.44771525,8 9,7.55228475 9,7 C9,6.44771525 9.44771525,6 10,6 L20,6 Z" />
            </symbol>
            <symbol ID="icPlay" viewBox="0 0 24 24">
                <path d="M8,3.53238076 C6.34314575,3.53238076 5,4.87552651 5,6.53238076 L5,17.4676192 C5,18.0113511 5.1477735,18.5448603 5.42752122,19.0111065 C6.2799657,20.4318473 8.12274647,20.8925425 9.54348727,20.040098 L18.656186,14.5724788 C19.0784348,14.3191295 19.4318282,13.9657361 19.6851775,13.5434873 C20.537622,12.1227465 20.0769268,10.2799657 18.656186,9.42752122 L9.54348727,3.95990198 C9.07724106,3.68015426 8.54373184,3.53238076 8,3.53238076 Z M8,5.53238076 C8.18124395,5.53238076 8.35908035,5.58163859 8.51449576,5.67488783 L17.6271945,11.1425071 C18.1007748,11.4266552 18.2543398,12.0409155 17.9701917,12.5144958 C17.8857419,12.6552454 17.7679441,12.7730432 17.6271945,12.8574929 L8.51449576,18.3251122 C8.04091549,18.6092603 7.42665523,18.4556953 7.14250707,17.982115 C7.04925783,17.8266996 7,17.6488632 7,17.4676192 L7,6.53238076 C7,5.98009601 7.44771525,5.53238076 8,5.53238076 Z" />
            </symbol>
            <symbol ID="icImage" viewBox="0 0 24 24">
                <path d="M17,2 C19.7614237,2 22,4.23857625 22,7 L22,7 L22,17 C22,19.7614237 19.7614237,22 17,22 L17,22 L7,22 C4.23857625,22 2,19.7614237 2,17 L2,17 L2,7 C2,4.23857625 4.23857625,2 7,2 L7,2 Z M16,12 C15.8297561,12 15.5946209,12.2378497 15.2734196,12.8038837 L15.1055488,13.1146676 L14.9227455,13.4826581 C14.8910012,13.5488965 14.8586103,13.6176231 14.8255604,13.6888901 L14.3890648,14.6566547 L14.1803282,15.0984849 C13.53366,16.4191512 13.0025432,17 12,17 C11.3307761,17 10.812497,16.8368878 10.0090244,16.4495 L9.31831527,16.1119469 L9.09036118,16.0093391 L8.90697512,15.9359222 L8.76121803,15.8889974 C8.6104198,15.8486563 8.52228012,15.8568939 8.4472136,15.8944272 C8.30414881,15.9659596 8.11698867,16.1194358 7.88932876,16.3525162 L7.68435724,16.5717397 C7.64857023,16.6115079 7.61197765,16.6528871 7.57458999,16.6958703 L7.340807,16.9729646 C7.30028096,17.022337 7.25898082,17.0732999 7.21691704,17.1258464 L6.95545469,17.4600748 L6.67616841,17.8319832 C6.62816333,17.8970898 6.57943654,17.9637527 6.52999854,18.0319652 L6.22491981,18.4597799 L5.90327507,18.9244561 L5.5655675,19.4256665 C5.53243943,19.4754556 5.49909687,19.5257438 5.46554181,19.5765298 C5.91415838,19.846071 6.43910316,20 7,20 L7,20 L17,20 C18.6568542,20 20,18.6568542 20,17 L20,17 L19.9998707,16.5619291 C19.4411584,16.1605501 18.9628238,15.5931969 18.3332607,14.6771273 L17.6679497,13.6797002 C17.486047,13.4068462 17.3213607,13.1723124 17.1710577,12.972542 L16.9560365,12.6985143 L16.7604657,12.4739638 C16.4495425,12.1394621 16.210809,12 16,12 Z M17,4 L7,4 C5.34314575,4 4,5.34314575 4,7 L4,7 L4,17 C4,17.3295217 4.05312788,17.6466347 4.15128526,17.9432406 L4.3462045,17.6548857 C4.40810659,17.5647094 4.46932646,17.4762377 4.5298746,17.3894636 L4.88518652,16.8891368 C5.0009928,16.7291156 5.11419602,16.5758306 5.22488003,16.4292273 L5.54945832,16.0094075 C6.3424293,15.0096976 6.99841223,14.3827599 7.5527864,14.1055728 C8.38270441,13.6906138 8.94469995,13.7459368 10.0020647,14.2244794 L10.4232877,14.4236794 L10.6541098,14.5379859 C10.7780334,14.6000077 10.8906334,14.6547492 10.993886,14.7028076 L11.2775772,14.8275305 C11.537178,14.9333981 11.7304355,14.9844907 11.9107022,14.996928 L11.9443746,14.9967053 C11.9280519,14.9921104 11.9287454,14.9811437 11.9454696,14.9550286 L12,14.88 C12.1185243,14.7219676 12.2462046,14.4994343 12.4032934,14.1784306 L12.9005785,13.0896353 C13.8754872,10.9231715 14.5678658,10 16,10 C17.2095852,10 17.9825322,10.6374853 19.0141196,12.1049639 L19.8067485,13.286551 L20,13.568 L20,7 C20,5.40231912 18.75108,4.09633912 17.1762728,4.00509269 L17,4 Z M9,6 C10.6568542,6 12,7.34314575 12,9 C12,10.6568542 10.6568542,12 9,12 C7.34314575,12 6,10.6568542 6,9 C6,7.34314575 7.34314575,6 9,6 Z M9,8 C8.44771525,8 8,8.44771525 8,9 C8,9.55228475 8.44771525,10 9,10 C9.55228475,10 10,9.55228475 10,9 C10,8.44771525 9.55228475,8 9,8 Z" />
            </symbol>
            <symbol ID="icImage2" viewBox="0 0 24 24">
                <path d="M16,7 C17.1143424,7 18.4295271,8.57121215 19.5441438,10.5880323 L19.8075954,11.0800485 C19.8939919,11.2465216 19.9788993,11.4152703 20.062112,11.5857182 L20.3064606,12.1015835 C20.3462695,12.1882186 20.3856034,12.2751344 20.4244365,12.362259 L20.6512209,12.8869343 L20.8647543,13.4131606 L20.9661666,13.6757748 L20.9661666,13.6757748 L21.1575115,14.1978441 C21.2492033,14.4573935 21.33477,14.7142827 21.4135179,14.9665669 L21.5617164,15.4644186 C21.8391079,16.4455364 22,17.3322244 22,18 C22,19.6060049 20.4344017,20.3060052 17.7640217,20.6899553 C16.1972149,20.9152325 14.4637981,20.9933553 12.4336944,20.9995105 L11.5677648,20.9995105 C9.53620185,20.9933553 7.80278511,20.9152325 6.23597834,20.6899553 C3.56559832,20.3060052 2,19.6060049 2,18 C2,15.4380799 4.88475194,11 7,11 C7.75239916,11 8.30673559,11.2622061 8.95745456,11.7977366 L9.17606666,11.9844701 L9.47686384,12.2525907 C10.1075624,12.8132116 10.4577906,13 11,13 C11.111969,13 11.2802962,12.847819 11.522927,12.4940925 L11.662748,12.2808661 C11.6873156,12.2418981 11.7125242,12.2011903 11.7383874,12.1587055 L11.9015287,11.8821773 L12.0810259,11.5612224 L12.2775261,11.1940608 L13.0048253,9.76854174 C13.0468792,9.68786397 13.088229,9.6092967 13.1289398,9.53279694 L13.3660553,9.09826444 C14.2495881,7.52502439 14.8638399,7 16,7 Z M16,9 C15.888031,9 15.7197038,9.15218104 15.477073,9.50590753 L15.337252,9.71913394 C15.3126844,9.75810191 15.2874758,9.79880972 15.2616126,9.84129446 L15.0984713,10.1178227 L14.9189741,10.4387776 L14.7224739,10.8059392 L13.9951747,12.2314583 C13.9531208,12.312136 13.911771,12.3907033 13.8710602,12.4672031 L13.6339447,12.9017356 C12.7504119,14.4749756 12.1361601,15 11,15 C9.93106209,15 9.21210949,14.6545653 8.33800348,13.9125104 L7.82246575,13.4574247 C7.42268428,13.1085245 7.21920091,13 7,13 C6.21524806,13 4,16.4080739 4,18 C4,18.1050885 4.17043163,18.2116137 4.47915482,18.3140104 L4.70510522,18.3816021 L4.96991468,18.4476042 L5.27146698,18.5116501 L5.6076459,18.5733736 L5.97633523,18.632408 L6.37541875,18.688387 C6.44434795,18.6974419 6.5144554,18.7063542 6.58569701,18.7151163 L7.25630347,18.7897132 L7.73387224,18.8343275 L8.23337033,18.8744206 L9.01910569,18.9252817 L9.56416861,18.952469 L10.4083315,18.9822536 L10.9857328,18.9942448 L11.5723662,18.9995163 L12.4290929,18.9995163 L13.015523,18.9942419 L13.5927409,18.9822511 L14.4366635,18.9524671 L14.981588,18.9252801 L15.767146,18.8744194 L16.2665445,18.8343265 L16.7440273,18.7897124 L17.4145284,18.7151157 L18.02381,18.6324077 L18.3924581,18.5733733 L18.7286045,18.51165 L19.0301318,18.4476041 L19.294923,18.3816021 L19.5208606,18.3140103 C19.8295684,18.2116137 20,18.1050885 20,18 C20,17.4665715 19.8092698,16.6373572 19.5083571,15.6935894 L19.3490918,15.2129984 L19.1737002,14.7183493 L18.9844196,14.2146764 L18.7834876,13.707014 L18.5731416,13.2003962 L18.355619,12.6998572 L18.1331573,12.2104314 L17.9079938,11.7371528 C17.8703657,11.6598984 17.8327183,11.5835265 17.7950981,11.508142 L17.5700772,11.0685236 L17.3479482,10.6576382 C17.311292,10.5918313 17.2748495,10.5274315 17.2386674,10.4645434 L17.0250714,10.1061965 C16.605619,9.42914287 16.2370793,9 16,9 Z M7.5,2 C9.43299662,2 11,3.56700338 11,5.5 C11,7.43299662 9.43299662,9 7.5,9 C5.56700338,9 4,7.43299662 4,5.5 C4,3.56700338 5.56700338,2 7.5,2 Z M7.5,4 C6.67157288,4 6,4.67157288 6,5.5 C6,6.32842712 6.67157288,7 7.5,7 C8.32842712,7 9,6.32842712 9,5.5 C9,4.67157288 8.32842712,4 7.5,4 Z" id="Combined-Shape" fill-rule="nonzero"></path>
            </symbol>
            <symbol ID="icSettings" viewBox="0 0 24 24">
                <path d="M17,3 C17.5128358,3 17.9355072,3.38604019 17.9932723,3.88337887 L18,4 L18.0007613,5.12621352 C19.7256022,5.57052105 21,7.13643475 21,9 C21,10.8635652 19.7256022,12.429479 18.0007613,12.8737865 L18,19 C18,19.5522847 17.5522847,20 17,20 C16.4871642,20 16.0644928,19.6139598 16.0067277,19.1166211 L16,19 L16.0002435,12.8740452 C14.2748927,12.4300871 13,10.8639271 13,9 C13,7.13607289 14.2748927,5.56991294 16.0002435,5.12595483 L16,4 C16,3.44771525 16.4477153,3 17,3 Z M17,7 C15.8954305,7 15,7.8954305 15,9 C15,10.1045695 15.8954305,11 17,11 C18.1045695,11 19,10.1045695 19,9 C19,7.8954305 18.1045695,7 17,7 Z M7,4 C7.51283584,4 7.93550716,4.38604019 7.99327227,4.88337887 L8,5 L8.00076134,11.1262135 C9.72560224,11.570521 11,13.1364348 11,15 C11,16.8635652 9.72560224,18.429479 8.00076134,18.8737865 L8,20 C8,20.5522847 7.55228475,21 7,21 C6.48716416,21 6.06449284,20.6139598 6.00672773,20.1166211 L6,20 L6.00024347,18.8740452 C4.27489272,18.4300871 3,16.8639271 3,15 C3,13.1360729 4.27489272,11.5699129 6.00024347,11.1259548 L6,5 C6,4.44771525 6.44771525,4 7,4 Z M7,13 C5.8954305,13 5,13.8954305 5,15 C5,16.1045695 5.8954305,17 7,17 C8.1045695,17 9,16.1045695 9,15 C9,13.8954305 8.1045695,13 7,13 Z" />
            </symbol>
            <symbol ID="icVersions" viewBox="0 0 24 24">
                <path d="M18,6 C19.6568542,6 21,7.34314575 21,9 L21,9 L21,19 C21,20.6568542 19.6568542,22 18,22 L18,22 L11,22 C9.34314575,22 8,20.6568542 8,19 L8,19 L8,9 C8,7.34314575 9.34314575,6 11,6 L11,6 Z M18,8 L11,8 C10.4477153,8 10,8.44771525 10,9 L10,9 L10,19 C10,19.5522847 10.4477153,20 11,20 L11,20 L18,20 C18.5522847,20 19,19.5522847 19,19 L19,19 L19,9 C19,8.44771525 18.5522847,8 18,8 L18,8 Z M13,2 C14.3062521,2 15.4175144,2.8348501 15.8293257,4.00008893 L6,4 C5.48716416,4 5.06449284,4.38604019 5.00672773,4.88337887 L5,5 L5,15 C5,15.5128358 5.38604019,15.9355072 5.88337887,15.9932723 L6,16 L6,18 C4.40231912,18 3.09633912,16.75108 3.00509269,15.1762728 L3,15 L3,5 C3,3.40231912 4.24891996,2.09633912 5.82372721,2.00509269 L6,2 L13,2 Z" />
            </symbol>
        </svg>      
    </div>
    `
}
// options{
//      generatorText: ""
// }
function buildMainHTML(options)
{

    const verPostfix = "?" + ExporterConstants.DOCUMENT_VERSION_PLACEHOLDER
    const srcPath = "srcPath" in options ? options.srcPath : ""

    let s = "";
    s += `
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="generator" content="${options.generatorText}">
        <title>${options.docName}</title>
        <link rel="shortcut icon"  type="image/png?" href="${srcPath}resources/icon.png${verPostfix}">
        <link rel="stylesheet" type="text/css" href="${srcPath}resources/viewer.css${verPostfix}">
    `
    if (options.enableAnimations)
    {
        s += `
        <link rel="stylesheet" type="text/css" href="${srcPath}resources/animations.css${verPostfix}">`
    }
    if (undefined != options.cssFileNames)
    {
        options.cssFileNames.forEach(function (cssFile)
        {
            s += `
        <link rel="stylesheet" type="text/css" href="${srcPath}resources/${cssFile}${verPostfix}">`
        })
    }
    s += `
        <link rel="stylesheet" type="text/css" href="${srcPath}resources/viewer-top.css${verPostfix}">
        <script type="text/javascript" src="${srcPath}js/other/jquery-3.3.1.min.js" charset="UTF-8"></script>
        <script type="text/javascript" src="${srcPath}js/other/jquery.hotkeys.js" charset="UTF-8"></script>
        <script type="text/javascript" src="${srcPath}js/other/jquery.ba-hashchange.min.js" charset="UTF-8"></script>
        <script type="text/javascript" src="${srcPath}js/ViewerPage.js${verPostfix}" charset="UTF-8"></script>
        <script type="text/javascript" src="data/story.js${verPostfix}" charset="UTF-8"></script>
        <script type="text/javascript" src="${srcPath}js/Viewer.js${verPostfix}" charset="UTF-8"></script>
        <script type="text/javascript" src="${srcPath}js/AbstractViewer.js${verPostfix}" charset="UTF-8"></script>
        <script type="text/javascript" src="${srcPath}js/CommentsViewer.js${verPostfix}" charset="UTF-8"></script>
    `
    if (!options.hideGallery)
    {
        s += `
            <script type="text/javascript" src="${srcPath}js/GalleryViewer.js${verPostfix}" charset="UTF-8"></script>
            `
    }
    s += `
        <script type="text/javascript" src="${srcPath}js/PresenterViewer.js${verPostfix}" charset="UTF-8"></script>
	`
    if (options.loadLayers)
    {
        s += `
        <script type="text/javascript" src="data/handoff.js${verPostfix}" charset="UTF-8"></script>
        <script type="text/javascript" src="${srcPath}js/SymbolViewer.js${verPostfix}" charset="UTF-8"></script>
		`
        if (options.enableExpViewer)
        {
            s += `
              <script type="text/javascript" src="${srcPath}js/ExpViewer.js${verPostfix}" charset="UTF-8"></script>
            `
        }
    }
    s += `
        <script type="text/javascript" src="${srcPath}js/InfoViewer.js${verPostfix}" charset="UTF-8"></script>
        <script type="text/javascript">
    `
    if (options.jsCode && options.jsCode != '')
    {
        s += `
        function runJSCode(){${options.jsCode}}
        `
    }
    s += `
        var viewer = new Viewer(story, "images")
        `
    s += '</script>'

    if (options.googleCode != '')
    {
        if (options.googleCode.startsWith("GTM"))
        {
            s += `
        <!--Google Tag Manager-->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?ID='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${options.googleCode}');</script>
            <!--End Google Tag Manager--> `
        } else
        {
            s += `
        <!--Global site tag(gtag.js) - Google Analytics-->
            <script async src="https://www.googletagmanager.com/gtag/js?ID=${options.googleCode}"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${options.googleCode}');
            </script>
    `
        }
    }
    s += `
        <script>
        function copyToBuffer(elID) {
            var copyText = document.getElementById(elID);

            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($(copyText).text()).select();
            document.execCommand("copy");
            $temp.remove();
        }
    function showFAIconInfo(code) {
        window.open("https://fontawesome.com/icons?d=gallery&q=" + code, "_blank")
    }
        </script>
        <!--HEAD_INJECT-->
    </head>
    <style>
        /* Safari syntax */
        :-webkit-full-screen {
            background-color: ${options.backColor};
        }
        /* IE11 */
        :-ms-fullscreen {
            background-color: ${options.backColor};
        }
        /* Standard syntax */
        :fullscreen {
            background-color: ${options.backColor};
        }

    </style>
    <body class="screen" style="background:${options.backColor}" onload="${options.jsCode && options.jsCode != "" ? "runJSCode()" : ""}">
            `
    if (options.googleCode != '')
    {
        if (options.googleCode.startsWith("GTM"))
        {
            s += `
            <!--Google Tag Manager(noscript)-->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?ID=${options.googleCode}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!--End Google Tag Manager(noscript)--> `
        }
    }

    s += buildMainHTML_NavigationIcons(options)
    s += `
        <div class="shaft1"></div><div class="shaft2"></div><div class="shaft3"></div>
        <div class="shaft4"></div><div class="shaft5"></div><div class="shaft6"></div><div class="shaft7"></div>
    </div>
   <!--/load indicator-->
        <div ID = "container">
        <div ID="marker"></div>
        <div ID="content" onclick="viewer.onContentClick()"></div>
        <div ID="sidebar" class="hidden">
            <div ID="symbol_viewer" class="hidden viewer">
                <div class="title">
                  <div style="width:100%;">Element Inspector</div>
                  <div style="width:24px; height:24px; cursor: pointer;" onclick="viewer.symbolViewer.toggle();  return false;">
                    <svg class="svgIcon"><use xlink:href="#icClose"></use></svg>
                  </div>
                </div>
                <div class="checkbox-container" style="margin-top:62px;display:none">
                  <input type="checkbox" ID="symbol_viewer_symbols" />
                  <label for="symbol_viewer_symbols"></label>
                  <span class="checkbox-label">Show symbols&nbsp;&nbsp;</span>
                  <select ID="lib_selector" style="width:200px;display:none;"></select>
                </div>
                <div ID="empty" style="padding: 16px 20px 0 20px;margin-top:20px;"></div>
                <div ID="symbol_viewer_content" style="margin-top:20px;">
                </div>
            </div>
            <div ID="comments_viewer" class="hidden viewer">
                <div class="title">
                    <div style="width:100%;">Comments</div>
                    <div style="width:24px; height:24px; cursor: pointer;" onclick="viewer.commentsViewer.toggle();  return false;">
                        <svg class="svgIcon"><use xlink:href="#icClose"></use></svg>
                    </div>
                </div>
                <div ID="comments_viewer_content">
                </div>
            </div>
            <div ID="info_viewer" class="hidden viewer">
                <div class="title">
                  <div style="width:100%;">Changes Inspector</div>
                  <div style="width:24px; height:24px; cursor: pointer;" onclick="viewer.infoViewer.toggle();  return false;">
                    <svg class="svgIcon"><use xlink:href="#icClose"></use></svg>
                  </div>
                </div>
                <div ID="info_viewer_content" style="padding: 72px 20px 0 20px"></div>
            </div>
            <div ID="exp_viewer" class="hidden viewer">
                <div class="title">
                  <div style="width:100%;">Widgets</div>
                  <div style="width:24px; height:24px; cursor: pointer;" onclick="viewer.expViewer.toggle();  return false;">
                    <svg class="svgIcon"><use xlink:href="#icClose"></use></svg>
                  </div>
                </div>
                <div ID="controls" style="padding: 62px 20px 0 20px">
                    <div class="label">Show</div>
                    <div>
                        <input type="radio" ID="exp-scope-project" name="exp-scope" checked onclick="viewer.expViewer.setScope('project')"/><label for="exp-scope-project">all pages</label>&nbsp;
                        <input type="radio" ID="exp-scope-page" name="exp-scope" onclick="viewer.expViewer.setScope('page')"/><label for="exp-scope-page">current page</label>
                    </div>
                    <div class="label">Group by</div>
                    <div>
                        <input type="radio" ID="exp-mode-widgets" name="exp-mode" checked onclick="viewer.expViewer.setMode('widgets')"/><label for="exp-mode-widgets">Widgets</label>&nbsp;
                        <input type="radio" ID="exp-mode-pages" name="exp-mode" onclick="viewer.expViewer.setMode('pages')"/><label for="exp-mode-pages">Pages</label>
                    </div>
                    <div class="label">Filter by</div>
                    <div>
                        <input type="radio" ID="exp-filter-exp" name="exp-filter" checked onclick="viewer.expViewer.setFilter('exp')"/><label for="exp-filter-exp">Experimental</label>&nbsp;
                        <input type="radio" ID="exp-filter-all" name="exp-filter" onclick="viewer.expViewer.setFilter('all')"/><label for="exp-filter-all">All</label>
                    </div>
                </div>
                <div ID="exp_viewer_content" style="padding: 20px 20px 0 20px"></div>
            </div>
        </div>
    <div ID="content-shadow" class="hidden" onclick="viewer.onContentClick()"></div>
    <div ID="content-modal" class="contentModal hidden" onclick="viewer.onModalClick()"></div>
           <div ID="gallery-modal" class="hidden">
    <div ID="gallery-header">
        <div ID="gallery-header-container">
            <div ID="title"><div>${options.docName}</div><div ID="screensamount"></div></div>
            <div ID="search"><input type="text" placeholder="Search screen..." ID="searchInput" onkeyup="viewer.galleryViewer.onSearchInputChange()"></div>
            <div ID="right">
                <div class="checkbox-container">
                    <input type="checkbox" ID="galleryShowMap" onclick="viewer.galleryViewer.enableMapMode(this.checked)" />
                    <label for="galleryShowMap"></label>
                    <span class="checkbox-label">Show map (M)</span>
                </div>
                <div ID="closebtn" onclick="viewer.galleryViewer.hide(); return false;"><svg class="svgIcon"><use xlink:href="#icCloseBtn"></use></svg></div>
            </div>
        </div>
    </div>
        <div ID = "gallery">
            <div ID="grid"></div></div>
                <div ID = "map-controls">
                    <div ID = "map-controls-container">
                    <div class="checkbox-container">
                        <input type = "checkbox" ID = "galleryShowMapLinks" onclick = "viewer.galleryViewer.showMapLinks(this.checked)" />
                        <label for= "galleryShowMapLinks"></label>
                        <span class="checkbox-label"> Show all links(L)</span>
                    </div>
                    <input type = "range" min = "0" max = "100" value = "50" class="mapZoom" onclick = "viewer.galleryViewer.mapZoomChanged(this.value)">
                    <span onclick = "viewer.galleryViewer.resetMapZoom();return false;" class="mapResetZoom"> Reset zoom</span>
               </div>
             </div>
           </div>
        <div ID = "nav" class="${options.hideNav ? "hidden" : "nav"}">
        <div class="navLeft">
            `
    //////////////////////////////////////////// GENERATE MENU //////////////////////////////////////
    // init menu content
    const menu = []
    menu.push(
        {
            ID: "", items: [
                { ID: "symbols", label: "Handoff", icon: "icElementInspector", key: "M", onclick: "viewer.symbolViewer.toggle();", on: options.loadLayers },
                { ID: "embed", label: "Embed code", icon: "icEmbed", key: "E", onclick: "viewer.share();" },
                { ID: "img", label: "Full page image", icon: "icImage2", key: "I", onclick: "viewer.openFullImage();" },
                { ID: "menu_comments_viewer", label: "Comments", icon: "icAnnotation", key: "C", onclick: "viewer.commentsViewer.toggle();", hidden: true },
                { ID: "figma", label: "Source in Figma", icon: "icAnnotation", key: "", onclick: "viewer.openFigma();", hidden: true },
            ]
        },
        {
            label: "Settings",
            icon: "icSettings",
            ID: "", items: [
                { ID: "links", label: "Hot spots", icon: "icPointer", key: "Shift", onclick: "viewer.toogleHightlighSpots(undefined,false);" },
                { ID: "zoom", label: "Autoscale", icon: "icResize", key: "Z", onclick: "viewer.toggleZoom(undefined,false);" },
                { ID: "pagegrid", label: "Grid layout", icon: "icGridLayout", key: "L", onclick: "viewer.toogleLayout(undefined,false);" },
                { ID: "ui", label: "Viewer controls", icon: "icHide", key: "N", onclick: "viewer.toogleUI()", checked: true },
                { ID: "fullscreen", label: "Full screen", icon: "", key: "F", onclick: "viewer.hideMenu();viewer.toogleFullScreen(undefined,false);" },
            ],
            switchers: true,
        },
        {
            label: "Versions",
            icon: "icVersions",
            ID: "", items: [
                { ID: "", label: "Up version", icon: "icIncreaseVersion", key: "⇧ ↑", onclick: "viewer.increaseVersion();", on: options.enableVersions },
                { ID: "", label: "Down version", icon: "icDecreaseVersion", key: "⇧ ↓", onclick: "viewer.decreaseVersion();", on: options.enableVersions },
                { ID: "menu_info_viewer", label: "Changes history", icon: "icList", key: "V", onclick: "viewer.infoViewer.toggle();", on: options.enableVersions },
            ]
        },
        {
            ID: "", items: [
                { ID: "", label: "View all screens", icon: "icGrid", key: "G", onclick: "viewer.galleryViewer.show()", on: !options.hideGallery },
                { ID: "start", label: "Go to start", icon: "icBack", key: "S", onclick: "viewer.goToPage(0)" },
                { ID: "play", label: "Play", icon: "icPlay", key: "P", onclick: "viewer.presenterViewer.play()" },
            ]
        }
    )
    // render menu
    s += `
            <div ID="menu" class="menu">
                `
    menu.forEach(function (group, index)
    {
        //
        if (group.on != null && !group.on) return
        const liveItems = group.items.filter(i => i.on == null || i.on)
        if (!liveItems.length) return
        //
        if (index > 0 && (menu[index - 1].label === undefined || group.label === undefined)) s += "<hr>\n"
        if (group.label !== undefined)
        {
            s += `
            <div class="groupe">
                <div ID="${group.ID}" class="item sub">
            `
            if (group.icon !== undefined && group.icon !== "")
                s += `<svg class ="svgIcon"><use xlink: href="#${group.icon}"></use></svg>`
            s += `
                <span>${group.label}</span>
                    <div class ="tips">
                        <svg class ='svgIcon'><use xlink: href="#icArrwRight"></use></svg>
                    </div>
                    <div class="submenu">
                        <div class="groupe">
            `
        } else
        {
            s += `<div class="groupe" ID="${group.ID}">`
        }
        liveItems.forEach(function (item)
        {
            if (item.on != null && !item.on) return
            if (group.switchers)
            {
                s += `
                <div ID="${item.ID}-div" class ="item item-switcher${item.hidden ? ' hidden' : ''}">
                    <div class="checkbox-container" onclick="document.getElementById('${item.ID}').checked=!document.getElementById('${item.ID}').checked;${item.onclick};">
                        <input type="checkbox" ID="${item.ID}" onclick="${item.onclick}; return true;" ${item.checked ? "checked" : ""}/>
                        <label for="${item.ID}"></label>
                        <span class="checkbox-label">${item.label}</span>
                    </div>
                    <div class ="tips">${item.key}</div>
                </div>
                `
            } else
            {
                s += `
                <div ID="${item.ID}" class ="item${item.hidden ? ' hidden' : ''}" onclick="viewer.hideMenu(); ${item.onclick}; return false; ">
                    <svg class ='svgIcon'><use xlink: href="#${item.icon}"></use></svg>
                    <span>${item.label}</span>
                    <div class ="tips">${item.key}</div>
                </div>
                `
            }
        })
        if (group.label !== undefined)
        {
            s += `
                    </div>
                  </div>
              </div>
            </div>
            `
        } else
            s += `</div>`
    })
    s += `
        </div>
            `
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    s += `
                <div ID = "btnMenu" class="btnMenu" onclick = "viewer.showMenu()">
                    <svg class='svgIcon'><use xlink:href="#icMenu"></use></svg>
        </div>
        <!--Button to embed mode-->
        <div ID="btnOpenNew" style='display:none' class="btnMenu" onclick="viewer.openNewWindow();return false;">
            <svg class='svgIcon'><use xlink:href="#icResize"></use></svg>
        </div>
        <!--Next / Back button-->
                <div class="navPreviewNext">
                    <div ID="nav-left-prev" class="btnPreview" onclick="viewer.previous(); return false;" title="Previous screen">
                        <svg class='svgIcon'><use xlink:href="#icArrwLeft"></use></svg>
                    </div>
                    <div ID="nav-left-next" class="btnNext" onclick="viewer.next(); return false;" title="Next screen"><svg class='svgIcon'><use xlink:href="#icArrwRight"></use></svg></div>
                </div>
        </div>
                <div class="navCenter">
                    <div class="pageName title">Default button</div>
                    <div ID="info_viewer_options" class="infoViewerMode hidden">
                        <input type="radio" name="info_viewer_mode" ID="info_viewer_mode_diff" value="diff" checked onclick="viewer.infoViewer.pageChanged()" disabled /><label for="info_viewer_mode_diff">Differences</label>
                        <input type="radio" name="info_viewer_mode" ID="info_viewer_mode_prev" value="prev" onclick="viewer.infoViewer.pageChanged()" disabled><label for="info_viewer_mode_prev">Prev version</label>
                            <input type="radio" name="info_viewer_mode" ID="info_viewer_mode_new" value="new " onclick="viewer.infoViewer.pageChanged()" disabled><label for="info_viewer_mode_new">New version</label>
                            </div>
                    </div>
                    <div class="navRight">
                        <div ID="loading" class="hidden">
                            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                        </div>
                        <div ID="pageComments" onclick="commentsViewer.toggle(); return false;" class="hidden">
                            <svg class="svgIcon"> <use xlink:href="#icAddComment"></use></svg>
                            <div ID="counter"></div>
                        </div>
                        <div ID="experimental" onclick="viewer.expViewer.toggle();return false;" class="hidden">
                            <svg class="svgIcon"> <use xlink:href="#icExperimental"></use></svg>
                        </div>
                    </div>
                </div>
        </div>
    </div>
                `
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    s += `
    </body>
</htm>
                `
    return s
}
