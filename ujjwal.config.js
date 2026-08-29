/**
 * Portfolio configuration (safe for the browser).
 *
 * Web3Forms access keys are PUBLIC and restricted by allowed domains at
 * https://web3forms.com — not the same as private API secrets.
 *
 * Setup:
 * 1. Sign up at https://web3forms.com with ujjwaldikshit1@gmail.com
 * 2. Copy your Access Key into web3formsAccessKey below
 * 3. Add your live site domain in the Web3Forms dashboard (and localhost if testing locally)
 */
window.PORTFOLIO_CONFIG = Object.freeze({
    web3formsAccessKey: '2081f55d-bbf9-43dc-8bd9-bb1a7c00bf0d',
    contact: Object.freeze({
        toEmail: 'ujjwaldikshit1@gmail.com',
        subjectPrefix: 'Portfolio message from'
    }),
    resumePdfPath: 'assets/resume.pdf'
});
