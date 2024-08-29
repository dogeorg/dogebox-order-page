import { LitElement, html, css } from '/vendor/@lit/all@3.1.2/lit-all.min.js';

class ProductCard extends LitElement {
  static styles = css`
    @import url("https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");

    :host {
      position: relative;
    }

    .card {
      position: relative;
      height: 540px;
      width: 310px;
      padding: 30px;
      box-sizing: border-box;
      background: linear-gradient(to bottom, #18191e, #18191d);
      border-radius: 8px;
    }
    .img img {
      width: 100%;
      height: 170px;
      position:relative;
      z-index: 1;
    }

    .headings h1 {
      color: white;
      font-family: "Montserrat", sans-serif;
      font-optical-sizing: auto;
      font-weight: 700;
      font-style: normal;
      font-size: 1.3rem;
      margin-bottom: 0em;
    }

    .headings h2 {
      font-family: "Lato", sans-serif;
      font-weight: 300;
      font-style: normal;
      line-height: 1.5;
      font-size: 1rem;
      color: #adb1bb;
      margin-top: 0.2em;
      margin-bottom: 1em;
    }

    .primary-action .button {
      width: 150px;
    }

    .footer-action .button {
      width: 100%;
    }

    .detail {
      font-family: "Lato", sans-serif;
      font-weight: 300;
      font-style: normal;
      line-height: 1.5;
      font-size: 0.8rem;
      color: #86878d;
      margin-top: 1.4em;
    }

    .button {
      padding: 10px 16px;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      color: white;

      font-family: "Montserrat", sans-serif;
      font-optical-sizing: auto;
      font-weight: 600;
      font-style: normal;
      font-size: 0.8rem;

      background-color: grey;
      &.blue { background-color: #47a8fe; color: #210d00; }
      &.yellow { background-color: #fce244; color: #210d00; }
      &.purple { background-color: #b26cfa; color: #210d00; }
    }
    .button.large {
      padding: 12px 18px;
      font-size: 0.9rem;
    }
    .button.outline {
      background-color: transparent;
      color: white;
      border: 1px solid #a0bdd5;
    }
    .pricing {
      display: flex;
      align-items: baseline;
      justify-content: center;
      margin: 1.5em;
    }
    .currency {
      font-size: 1rem;
      font-family: "Montserrat", sans-serif;
      font-optical-sizing: auto;
      font-weight: 600;
      font-style: normal;
    }
    .val {
      font-size: 32px;
      margin-left: 4px;
      font-family: "Montserrat", sans-serif;
      font-optical-sizing: auto;
      font-weight: 600;
      font-style: normal;
      font-size: 1.6rem;
    }
    .tag {
      margin-left: 8px;
      font-family: "Lato", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size:0.8rem;
      color: var(--color-gold-light);
      text-transform: uppercase;
    }

    .radial {
      top: 0px;
      left: 0px;
      width: 100%;
      height: 240px;
      z-index: 0;
      position: absolute;
      &.blue {
        background: radial-gradient(
          circle at center,
          rgb(25, 66, 98, 1),
          rgba(25, 66, 98, 0.5),
          rgba(25, 66, 98, 0.2),
          rgba(25, 66, 98, 0.03),
          transparent
        );
      }
      &.yellow {
        background: radial-gradient(
          circle at center,
          rgb(81, 67, 11),
          rgba(81, 67, 11, 0.5),
          rgba(81, 67, 11, 0.2),
          rgba(81, 67, 11, 0.03),
          transparent
        );
      }
      &.purple {
        background: radial-gradient(
          circle at center,
          rgb(85, 35, 135),
          rgba(85, 35, 135, 0.5),
          rgba(85, 35, 135, 0.2),
          rgba(85, 35, 135, 0.03),
          transparent
        );
      }

    }
  `;

  static get properties() {
    return {
      theme: { type: String },
      price: { type: String },
      title: { type: String },
      subtitle: { type: String },
      image: { type: String },
      desc: { type: String },
    }
  }

  render() {
    return html`
      <div class="card">
        <div class="img">
          <img src="${this.image}" />
        </div>
        <div class="radial ${this.theme}"></div>
        <div class="headings">
          <h1>${this.title}</h1>
          <h2>${this.subtitle}</h2>
        </div>
        <div class="primary-action">
          <button class="button pill ${this.theme}">
            Pre-order
          </button>
        </div>
        <div class="detail">
          ${this.desc}
        </div>
        <div class="pricing">
          <span class="currency">Ð</span>
          <span class="val">${this.price}</span>
          <span class="tag">dogecoin</span>
        </div>
        <div class="footer-action">
          <button class="button large outline ${this.theme}">Limited supply</button>
        </div>
      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);
