import { LitElement, html, css } from "/vendor/@lit/all@3.1.2/lit-all.min.js";

class SiteFooter extends LitElement {
  render() {
    return html`<footer>
      <div class="footer-container">
        <img class="footer-image" src="/img/footer-map.png" />
        <div class="footer-row">
          <div class="footer-column1" style="padding-top:10px">
            <div class="logo">
              <img src="/img/doge-logo.png" alt="Dogecoin logo" />
              <div class="logo-labels">
                <div class="main-label footer-label comic-neue">DOGECOIN</div>
              </div>
            </div>
            <p style="padding-top:10px" class="comic-neue">
              The Shiba Inu is a Japanese breed of dog that was popularized as
              an online meme and represents Dogecoin. Dogecoin was created by
              Jackson Palmer &amp; Shibetoshi Nakamoto.
            </p>
          </div>
          <div class="footer-column">
            <a class="footer-title comic-neue-bold">Legal</a>
            <li><a target="_blank" href="https://dogecoin.com/trademarks">Trademarks</a></li>
          </div>
          <div class="footer-column">
            <a class="footer-title comic-neue-bold">Sitemap</a>
            <li><a target="_blank" href="https://dogecoin.com/">So Home</a></li>
            <li><a target="_blank" href="https://dogecoin.com/#what-is-dogecoin">What is Dogecoin?</a></li>
            <li><a target="_blank" href="https://dogecoin.com/wallets/">Much Wallets</a></li>
            <li><a target="_blank" href="https://dogecoin.com/#community">Very Community</a></li>
            <li><a target="_blank" href="https://dogecoin.com/dogepedia/">So Dogepedia</a></li>
          </div>
          <div class="footer-column">
            <a class="footer-title comic-neue-bold">Foundation</a>
            <li><a target="_blank" href="https://foundation.dogecoin.com/about/">About</a></li>
            <li><a target="_blank" href="https://foundation.dogecoin.com/manifesto/">Manifesto</a></li>
            <li><a target="_blank" href="https://foundation.dogecoin.com/about/">Advisors</a></li>
            <li><a target="_blank" href="https://foundation.dogecoin.com/announcements/">Blog</a></li>
            <li><a target="_blank" href="https://foundation.dogecoin.com/trailmap/prologue/">Trailmap</a></li>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer__inner">
          <div class="footer__content" style="display:block;text-align:center">
            <div class="row">
              <div class="text-wrap footer-credits comic-neue">
                <span><a href="https://dogecoin.com/contributors/" class="fw-normal text-decoration-none" >Contributors</a></span>
              </div>
              <p style="text-align:center" class="comic-neue">
                © 2013-2024 | The Dogecoin Foundation &amp; Dogecoin Project.
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>`;
  }

  static styles = css`
    @import url("https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");

    :host {
      --max-width: 1400px;
      --dark-color-secondary: #cfcfcf;
      --dark-color-tertiary: #44444b;
      --dark-color: white;
      display: block;
      padding: 20px;
      color: #fff;
      background: #000000;
      font-family: "Lato", -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;

      @media (min-width: 576px) {
        .footer, .footer-container {
          max-width: 540px;
        }
      }

      @media (min-width: 768px) {
        .footer, .footer-container {
          max-width: 720px;
        }
      }

      @media (min-width: 1200px) {
        .footer, .footer-container {
          max-width: 1140px;
        }
      }

      @media (min-width: 1400px) {
        .footer, .footer-container {
          max-width: 1200px !important;
        }
      }
    }

    p {
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }

    .comic-neue {
      font-family: "Comic Neue", cursive !important;
    }

    .logo {
      color: #ffffff;
      display: flex;
      text-decoration: none;
      font-weight: bold;
      font-display: auto;
      padding-right: 1vw;
      align-items: center;

      img {
        height: 42px;
        transition: height .2s ease-in;
        max-width: 100%;
        display: block;
      }

      .logo-labels {
        margin-left: 10px;
        font-size: 1.5em;
        font-family: "Comic Neue", cursive !important;
      }
    }

    a:visited, a:link, a {
      text-decoration: none;
      color: inherit !important; 
      &:hover { color: #ffc107 !important }
    }

    .footer-container {
      position: relative;
      max-width: var(--max-width);
      margin: auto;
      text-align: left;
      padding: 50px 0;
    }
    .footer-container .footer-row {
      position: relative;
      position: z-index: 1;
      display: flex;
      flex-wrap: wrap;
    }
    .footer-container .footer-row .footer-column1 {
      width: 34%;
    }
    .footer-container .footer-row .footer-column1 p {
      padding-top: 20px;
      font-size: 0.9rem;
      color: #999;
      line-height: 1.7;
      width: 80%;
    }
    .footer-container .footer-row .footer-column {
      width: 22%;
      color: var(--dark-color-secondary);
    }
    .footer-container .footer-row .footer-column .footer-title {
      font-size: 22px;
      line-height: 60px;
      margin-bottom: 10px;
      text-decoration: none;
      color: white !important;
    }
    .footer-container .footer-row .footer-column li {
      list-style: none;
      margin-bottom: 10px;
    }
    .footer-container .footer-row .footer-column li a {
      text-decoration: none;
      font-size: 0.9rem;
    }
    .footer-container .footer-row .footer-column li a {
      color: var(--dark-color-secondary);
    }

    .footer .footer-credits-box {
      display: inline;
    }
    .footer .footer-credits-box .footer-credits {
      display: inline-block;
      width: fit-content;
    }

    .footer-label {
      color: var(--dark-color);
    }

    @media (max-width: 768px) {
      .footer-image {
        display: none;
      }
      .footer-column1 {
        margin-bottom: 20px;
        padding-left: 0;
        width: 50% !important;
      }
      .footer-column {
        width: 50% !important;
        margin-bottom: 20px;
      }
    }
    @media (max-width: 480px) {
      .footer-image {
        display: none;
      }
      .footer-column1 {
        position: relative;
        padding-right: 1em !important;
        width: 100% !important;
      }
      .footer-column {
        position: relative;
        width: 80% !important;
        margin-bottom: 20px;
        margin: auto;
      }
    }

    .footer-image {
      position: absolute;
      bottom: 0px;
      height: 300px;
      width: auto;
      left: 15vw;
      z-index: 0;
    }

    .footer {
      position: relative;
      padding: 10px 20px;
      flex-grow: 0;
      color: var(--dark-color-tertiary);
      margin: auto;
      line-height: 1;
    }
    @media (max-width: 480px) {
      .footer {
        margin-top: 15px;
      }
    }
    .footer {
      padding-top: 1em;
      border-top: 1px solid var(--dark-color-tertiary);
    }
  `;
}

customElements.define("site-footer", SiteFooter);
