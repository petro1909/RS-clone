interface IHTMLElemAttributes {
  [key: string]: string;
}

const createElement = (
  tag: string,
  parent?: ShadowRoot | HTMLElement | null,
  attrs?: IHTMLElemAttributes,
  innerContent?: string,
): Element => {
  const el = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
  }
  if (parent) {
    parent.appendChild(el);
  }
  if (innerContent) {
    el.innerHTML = innerContent;
  }
  return el;
};

export default createElement;
