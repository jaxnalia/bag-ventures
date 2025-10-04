import { c as create_ssr_component, e as escape, o as onDestroy$1, a as add_styles, v as validate_component, m as missing_component, b as spread, d as escape_object, f as merge_ssr_styles, g as add_attribute, h as subscribe$1, i as each } from "./ssr.js";
import { BehaviorSubject, Subject, defer, firstValueFrom, fromEvent, takeUntil as takeUntil$1, startWith as startWith$1, shareReplay as shareReplay$1, distinctUntilChanged, filter as filter$1, mapTo, take as take$1, fromEventPattern } from "rxjs";
import { shareReplay, withLatestFrom, pluck, take, takeUntil, distinctUntilKeyChanged, filter, map, startWith, share, switchMap } from "rxjs/operators";
import bowser from "bowser";
import { d as derived, w as writable } from "./index.js";
import deepmerge from "deepmerge";
import { IntlMessageFormat } from "intl-messageformat";
import { nanoid } from "nanoid";
import Joi from "joi";
import { chainIdValidation, chainNamespaceValidation, chainValidation, ProviderRpcErrorCode, validate, chainIdToViemImport, weiToEth, weiHexToEth, isAddress } from "@web3-onboard/common";
import partition from "lodash.partition";
import { isHex, toHex } from "viem";
import merge from "lodash.merge";
import EventEmitter from "eventemitter3";
import injectedModule from "@web3-onboard/injected-wallets";
import { u as useToasterStore, t as toast, a as update$1, e as endPause, s as startPause, p as prefersReducedMotion } from "./Toaster.svelte_svelte_type_style_lang.js";
function delve(obj, fullKey) {
  if (fullKey == null)
    return void 0;
  if (fullKey in obj) {
    return obj[fullKey];
  }
  const keys = fullKey.split(".");
  let result = obj;
  for (let p = 0; p < keys.length; p++) {
    if (typeof result === "object") {
      if (p > 0) {
        const partialKey = keys.slice(p, keys.length).join(".");
        if (partialKey in result) {
          result = result[partialKey];
          break;
        }
      }
      result = result[keys[p]];
    } else {
      result = void 0;
    }
  }
  return result;
}
const lookupCache = {};
const addToCache = (path, locale2, message) => {
  if (!message)
    return message;
  if (!(locale2 in lookupCache))
    lookupCache[locale2] = {};
  if (!(path in lookupCache[locale2]))
    lookupCache[locale2][path] = message;
  return message;
};
const lookup = (path, refLocale) => {
  if (refLocale == null)
    return void 0;
  if (refLocale in lookupCache && path in lookupCache[refLocale]) {
    return lookupCache[refLocale][path];
  }
  const locales = getPossibleLocales(refLocale);
  for (let i = 0; i < locales.length; i++) {
    const locale2 = locales[i];
    const message = getMessageFromDictionary(locale2, path);
    if (message) {
      return addToCache(path, refLocale, message);
    }
  }
  return void 0;
};
let dictionary;
const $dictionary = writable({});
function getLocaleDictionary(locale2) {
  return dictionary[locale2] || null;
}
function hasLocaleDictionary(locale2) {
  return locale2 in dictionary;
}
function getMessageFromDictionary(locale2, id) {
  if (!hasLocaleDictionary(locale2)) {
    return null;
  }
  const localeDictionary = getLocaleDictionary(locale2);
  const match = delve(localeDictionary, id);
  return match;
}
function getClosestAvailableLocale(refLocale) {
  if (refLocale == null)
    return void 0;
  const relatedLocales = getPossibleLocales(refLocale);
  for (let i = 0; i < relatedLocales.length; i++) {
    const locale2 = relatedLocales[i];
    if (hasLocaleDictionary(locale2)) {
      return locale2;
    }
  }
  return void 0;
}
function addMessages(locale2, ...partials) {
  delete lookupCache[locale2];
  $dictionary.update((d) => {
    d[locale2] = deepmerge.all([d[locale2] || {}, ...partials]);
    return d;
  });
}
derived(
  [$dictionary],
  ([dictionary2]) => Object.keys(dictionary2)
);
$dictionary.subscribe((newDictionary) => dictionary = newDictionary);
const queue = {};
function removeLoaderFromQueue(locale2, loader) {
  queue[locale2].delete(loader);
  if (queue[locale2].size === 0) {
    delete queue[locale2];
  }
}
function getLocaleQueue(locale2) {
  return queue[locale2];
}
function getLocalesQueues(locale2) {
  return getPossibleLocales(locale2).map((localeItem) => {
    const localeQueue = getLocaleQueue(localeItem);
    return [localeItem, localeQueue ? [...localeQueue] : []];
  }).filter(([, localeQueue]) => localeQueue.length > 0);
}
function hasLocaleQueue(locale2) {
  if (locale2 == null)
    return false;
  return getPossibleLocales(locale2).some(
    (localeQueue) => {
      var _a;
      return (_a = getLocaleQueue(localeQueue)) == null ? void 0 : _a.size;
    }
  );
}
function loadLocaleQueue(locale2, localeQueue) {
  const allLoadersPromise = Promise.all(
    localeQueue.map((loader) => {
      removeLoaderFromQueue(locale2, loader);
      return loader().then((partial) => partial.default || partial);
    })
  );
  return allLoadersPromise.then((partials) => addMessages(locale2, ...partials));
}
const activeFlushes = {};
function flush$1(locale2) {
  if (!hasLocaleQueue(locale2)) {
    if (locale2 in activeFlushes) {
      return activeFlushes[locale2];
    }
    return Promise.resolve();
  }
  const queues = getLocalesQueues(locale2);
  activeFlushes[locale2] = Promise.all(
    queues.map(
      ([localeName, localeQueue]) => loadLocaleQueue(localeName, localeQueue)
    )
  ).then(() => {
    if (hasLocaleQueue(locale2)) {
      return flush$1(locale2);
    }
    delete activeFlushes[locale2];
  });
  return activeFlushes[locale2];
}
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __objRest$1 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultFormats = {
  number: {
    scientific: { notation: "scientific" },
    engineering: { notation: "engineering" },
    compactLong: { notation: "compact", compactDisplay: "long" },
    compactShort: { notation: "compact", compactDisplay: "short" }
  },
  date: {
    short: { month: "numeric", day: "numeric", year: "2-digit" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  },
  time: {
    short: { hour: "numeric", minute: "numeric" },
    medium: { hour: "numeric", minute: "numeric", second: "numeric" },
    long: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    },
    full: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    }
  }
};
function defaultMissingKeyHandler({ locale: locale2, id }) {
  console.warn(
    `[svelte-i18n] The message "${id}" was not found in "${getPossibleLocales(
      locale2
    ).join('", "')}".${hasLocaleQueue(getCurrentLocale()) ? `

Note: there are at least one loader still registered to this locale that wasn't executed.` : ""}`
  );
}
const defaultOptions = {
  fallbackLocale: null,
  loadingDelay: 200,
  formats: defaultFormats,
  warnOnMissingMessages: true,
  handleMissingMessage: void 0,
  ignoreTag: true
};
const options = defaultOptions;
function getOptions() {
  return options;
}
function init$2(opts) {
  const _a = opts, { formats } = _a, rest = __objRest$1(_a, ["formats"]);
  let initialLocale = opts.fallbackLocale;
  if (opts.initialLocale) {
    try {
      if (IntlMessageFormat.resolveLocale(opts.initialLocale)) {
        initialLocale = opts.initialLocale;
      }
    } catch (e) {
      console.warn(
        `[svelte-i18n] The initial locale "${opts.initialLocale}" is not a valid locale.`
      );
    }
  }
  if (rest.warnOnMissingMessages) {
    delete rest.warnOnMissingMessages;
    if (rest.handleMissingMessage == null) {
      rest.handleMissingMessage = defaultMissingKeyHandler;
    } else {
      console.warn(
        '[svelte-i18n] The "warnOnMissingMessages" option is deprecated. Please use the "handleMissingMessage" option instead.'
      );
    }
  }
  Object.assign(options, rest, { initialLocale });
  if (formats) {
    if ("number" in formats) {
      Object.assign(options.formats.number, formats.number);
    }
    if ("date" in formats) {
      Object.assign(options.formats.date, formats.date);
    }
    if ("time" in formats) {
      Object.assign(options.formats.time, formats.time);
    }
  }
  return $locale.set(initialLocale);
}
const $isLoading = writable(false);
var __defProp$1 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
let current;
const internalLocale = writable(null);
function getSubLocales(refLocale) {
  return refLocale.split("-").map((_, i, arr) => arr.slice(0, i + 1).join("-")).reverse();
}
function getPossibleLocales(refLocale, fallbackLocale = getOptions().fallbackLocale) {
  const locales = getSubLocales(refLocale);
  if (fallbackLocale) {
    return [.../* @__PURE__ */ new Set([...locales, ...getSubLocales(fallbackLocale)])];
  }
  return locales;
}
function getCurrentLocale() {
  return current != null ? current : void 0;
}
internalLocale.subscribe((newLocale) => {
  current = newLocale != null ? newLocale : void 0;
  if (typeof window !== "undefined" && newLocale != null) {
    document.documentElement.setAttribute("lang", newLocale);
  }
});
const set = (newLocale) => {
  if (newLocale && getClosestAvailableLocale(newLocale) && hasLocaleQueue(newLocale)) {
    const { loadingDelay } = getOptions();
    let loadingTimer;
    if (typeof window !== "undefined" && getCurrentLocale() != null && loadingDelay) {
      loadingTimer = window.setTimeout(
        () => $isLoading.set(true),
        loadingDelay
      );
    } else {
      $isLoading.set(true);
    }
    return flush$1(newLocale).then(() => {
      internalLocale.set(newLocale);
    }).finally(() => {
      clearTimeout(loadingTimer);
      $isLoading.set(false);
    });
  }
  return internalLocale.set(newLocale);
};
const $locale = __spreadProps(__spreadValues$1({}, internalLocale), {
  set
});
const getLocaleFromNavigator = () => {
  if (typeof window === "undefined")
    return null;
  return window.navigator.language || window.navigator.languages[0];
};
const monadicMemoize = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  const memoizedFn = (arg) => {
    const cacheKey = JSON.stringify(arg);
    if (cacheKey in cache) {
      return cache[cacheKey];
    }
    return cache[cacheKey] = fn(arg);
  };
  return memoizedFn;
};
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const getIntlFormatterOptions = (type, name) => {
  const { formats } = getOptions();
  if (type in formats && name in formats[type]) {
    return formats[type][name];
  }
  throw new Error(`[svelte-i18n] Unknown "${name}" ${type} format.`);
};
const createNumberFormatter = monadicMemoize(
  (_a) => {
    var _b = _a, { locale: locale2, format } = _b, options2 = __objRest(_b, ["locale", "format"]);
    if (locale2 == null) {
      throw new Error('[svelte-i18n] A "locale" must be set to format numbers');
    }
    if (format) {
      options2 = getIntlFormatterOptions("number", format);
    }
    return new Intl.NumberFormat(locale2, options2);
  }
);
const createDateFormatter = monadicMemoize(
  (_c) => {
    var _d = _c, { locale: locale2, format } = _d, options2 = __objRest(_d, ["locale", "format"]);
    if (locale2 == null) {
      throw new Error('[svelte-i18n] A "locale" must be set to format dates');
    }
    if (format) {
      options2 = getIntlFormatterOptions("date", format);
    } else if (Object.keys(options2).length === 0) {
      options2 = getIntlFormatterOptions("date", "short");
    }
    return new Intl.DateTimeFormat(locale2, options2);
  }
);
const createTimeFormatter = monadicMemoize(
  (_e) => {
    var _f = _e, { locale: locale2, format } = _f, options2 = __objRest(_f, ["locale", "format"]);
    if (locale2 == null) {
      throw new Error(
        '[svelte-i18n] A "locale" must be set to format time values'
      );
    }
    if (format) {
      options2 = getIntlFormatterOptions("time", format);
    } else if (Object.keys(options2).length === 0) {
      options2 = getIntlFormatterOptions("time", "short");
    }
    return new Intl.DateTimeFormat(locale2, options2);
  }
);
const getNumberFormatter = (_g = {}) => {
  var _h = _g, {
    locale: locale2 = getCurrentLocale()
  } = _h, args = __objRest(_h, [
    "locale"
  ]);
  return createNumberFormatter(__spreadValues({ locale: locale2 }, args));
};
const getDateFormatter = (_i = {}) => {
  var _j = _i, {
    locale: locale2 = getCurrentLocale()
  } = _j, args = __objRest(_j, [
    "locale"
  ]);
  return createDateFormatter(__spreadValues({ locale: locale2 }, args));
};
const getTimeFormatter = (_k = {}) => {
  var _l = _k, {
    locale: locale2 = getCurrentLocale()
  } = _l, args = __objRest(_l, [
    "locale"
  ]);
  return createTimeFormatter(__spreadValues({ locale: locale2 }, args));
};
const getMessageFormatter = monadicMemoize(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (message, locale2 = getCurrentLocale()) => new IntlMessageFormat(message, locale2, getOptions().formats, {
    ignoreTag: getOptions().ignoreTag
  })
);
const formatMessage = (id, options2 = {}) => {
  var _a, _b, _c, _d;
  let messageObj = options2;
  if (typeof id === "object") {
    messageObj = id;
    id = messageObj.id;
  }
  const {
    values,
    locale: locale2 = getCurrentLocale(),
    default: defaultValue
  } = messageObj;
  if (locale2 == null) {
    throw new Error(
      "[svelte-i18n] Cannot format a message without first setting the initial locale."
    );
  }
  let message = lookup(id, locale2);
  if (!message) {
    message = (_d = (_c = (_b = (_a = getOptions()).handleMissingMessage) == null ? void 0 : _b.call(_a, { locale: locale2, id, defaultValue })) != null ? _c : defaultValue) != null ? _d : id;
  } else if (typeof message !== "string") {
    console.warn(
      `[svelte-i18n] Message with id "${id}" must be of type "string", found: "${typeof message}". Gettin its value through the "$format" method is deprecated; use the "json" method instead.`
    );
    return message;
  }
  if (!values) {
    return message;
  }
  let result = message;
  try {
    result = getMessageFormatter(message, locale2).format(values);
  } catch (e) {
    if (e instanceof Error) {
      console.warn(
        `[svelte-i18n] Message "${id}" has syntax error:`,
        e.message
      );
    }
  }
  return result;
};
const formatTime = (t, options2) => {
  return getTimeFormatter(options2).format(t);
};
const formatDate = (d, options2) => {
  return getDateFormatter(options2).format(d);
};
const formatNumber = (n, options2) => {
  return getNumberFormatter(options2).format(n);
};
const getJSON = (id, locale2 = getCurrentLocale()) => {
  return lookup(id, locale2);
};
const $format = derived([$locale, $dictionary], () => formatMessage);
derived([$locale], () => formatTime);
derived([$locale], () => formatDate);
derived([$locale], () => formatNumber);
derived([$locale, $dictionary], () => getJSON);
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
var defaultBnIcon = `<svg width="756" height="756" viewBox="0 0 756 756" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_210_16)">
<rect x="22" y="22" width="712.081" height="712.081" rx="100" fill="white"/>
<rect x="21.5" y="21.5" width="713.081" height="713.081" rx="100.5" stroke="#CCCCCC" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M388.846 243.497C391.572 244.066 394.144 245.216 396.391 246.871C398.905 248.87 400.831 251.522 401.963 254.539C409.105 272.488 416.247 290.426 423.39 308.352C431.294 328.289 439.237 348.23 447.22 368.174C451.381 378.631 455.52 389.098 459.744 399.533C460.643 401.668 461.107 403.962 461.107 406.28C461.107 408.598 460.643 410.893 459.744 413.027L423.444 503.98C421.04 510 416.686 513.743 410.284 514.719C402.319 515.923 395.194 511.974 392.316 504.956C385.505 488.132 378.844 471.255 372.129 454.387L337.984 368.586C327.874 343.124 317.749 317.67 307.611 292.222C304.248 283.772 300.993 275.279 297.479 266.894C296.512 264.614 296.054 262.148 296.139 259.671C296.223 257.193 296.848 254.764 297.969 252.557C299.09 250.349 300.68 248.417 302.625 246.896C304.571 245.376 306.825 244.304 309.228 243.757C309.518 243.692 309.799 243.584 310.079 243.497H388.846Z" fill="url(#paint0_linear_210_16)"/>
<path d="M247.379 243.497C248.273 243.747 249.168 243.963 250.041 244.267C252.313 244.981 254.399 246.198 256.143 247.829C257.887 249.46 259.245 251.464 260.118 253.693C267.915 273.131 275.675 292.584 283.399 312.051C291.217 331.677 299.035 351.307 306.852 370.94C310.675 380.565 314.516 390.187 318.374 399.804C319.238 401.864 319.683 404.077 319.683 406.312C319.683 408.548 319.238 410.761 318.374 412.821C314.063 423.625 309.752 434.425 305.44 445.221C297.536 464.985 289.632 484.748 281.728 504.512C280.487 507.589 278.366 510.226 275.633 512.087C272.901 513.949 269.68 514.952 266.38 514.968C262.884 515.03 259.455 514.004 256.561 512.029C253.667 510.055 251.45 507.228 250.213 503.937C242.906 485.312 235.447 466.742 228.053 448.15C218.144 422.977 208.185 397.823 198.176 372.686C187.987 347.102 177.802 321.513 167.62 295.921C163.761 286.235 159.935 276.527 156.023 266.851C154.313 262.819 154.23 258.277 155.791 254.185C157.353 250.093 160.435 246.773 164.386 244.929C165.82 244.346 167.293 243.867 168.795 243.497H247.379Z" fill="url(#paint1_linear_210_16)"/>
<path d="M599.828 408.922C597.67 416.244 594.438 423.154 591.69 430.215C583.736 450.304 575.738 470.382 567.695 490.449C565.852 495.049 563.976 499.637 562.188 504.258C560.928 507.415 558.759 510.12 555.952 512.021C553.15 513.923 549.845 514.934 546.463 514.923C543.081 514.913 539.784 513.881 536.992 511.963C534.2 510.043 532.042 507.325 530.803 504.16L495.904 416.494L465.724 340.77C455.873 316.046 446.029 291.325 436.192 266.608C435.257 264.348 434.826 261.909 434.929 259.463C435.032 257.017 435.667 254.623 436.79 252.451C437.912 250.279 439.494 248.381 441.424 246.892C443.355 245.402 445.587 244.356 447.962 243.829C448.286 243.753 448.598 243.645 448.921 243.547H527.689C527.934 243.623 528.173 243.72 528.422 243.775C531.184 244.355 533.756 245.627 535.9 247.474C538.043 249.321 539.692 251.682 540.689 254.34C545.272 265.91 549.863 277.448 554.461 288.953C566.497 319.166 578.522 349.379 590.536 379.592C593.695 387.553 597.208 395.374 599.795 403.553L599.828 408.922Z" fill="url(#paint2_linear_210_16)"/>
</g>
<defs>
<filter id="filter0_d_210_16" x="0.348907" y="0.348907" width="755.384" height="755.383" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="10.3255"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
<feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow_210_16"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_16" result="shape"/>
</filter>
<linearGradient id="paint0_linear_210_16" x1="283.92" y1="265.538" x2="474.49" y2="454.896" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF00A8"/>
<stop offset="1" stop-color="#6200C6"/>
</linearGradient>
<linearGradient id="paint1_linear_210_16" x1="142.528" y1="265.473" x2="333.054" y2="454.788" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF00A8"/>
<stop offset="1" stop-color="#6200C6"/>
</linearGradient>
<linearGradient id="paint2_linear_210_16" x1="422.73" y1="265.469" x2="613.268" y2="454.794" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF00A8"/>
<stop offset="1" stop-color="#6200C6"/>
</linearGradient>
</defs>
</svg>
`;
var poweredByThirdweb = `
<svg width="170" height="17" viewBox="0 0 170 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_208_15)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M122.262 1.76074C121.506 1.76074 120.886 2.37313 120.886 3.15393C120.886 3.91942 121.506 4.53181 122.262 4.53181C123.019 4.53181 123.639 3.91942 123.639 3.15393C123.639 2.37313 123.019 1.76074 122.262 1.76074ZM123.472 5.23601H121.068V13.4879H123.472V5.23601ZM107.034 2.06696H109.378V5.23607H111.178V7.44068H109.378V10.3495C109.378 10.7782 109.711 11.115 110.119 11.115H111.162V13.4574H110.119C108.425 13.4574 107.034 12.0642 107.034 10.3342V7.42536H105.945V5.22076H107.034V2.06696ZM116.909 5.05236C115.82 5.05236 114.958 5.51164 114.626 6.23121V2.06696H112.221V13.4727H114.626V8.84917C114.626 7.88466 115.246 7.21103 116.123 7.21103C117.015 7.21103 117.514 7.79281 117.514 8.77262V13.488H119.919V8.46642C119.919 6.32307 118.83 5.05236 116.909 5.05236ZM126.905 5.22072V6.35364C127.268 5.52691 128.145 5.05232 129.249 5.03701C129.415 5.03701 129.627 5.05232 129.884 5.08293V7.3794C129.642 7.33346 129.37 7.30285 129.083 7.30285C127.707 7.30285 126.905 8.08364 126.905 9.44619V13.4727H124.501V5.22072H126.905ZM136.644 6.30776C136.402 5.58819 135.449 5.08299 134.224 5.08299C133.075 5.08299 132.107 5.49634 131.336 6.32307C130.58 7.13448 130.187 8.16023 130.187 9.3544C130.187 10.5486 130.58 11.559 131.336 12.401C132.107 13.2124 133.075 13.6258 134.224 13.6258C135.449 13.6258 136.402 13.1206 136.644 12.401V13.488H139.048V2.06696H136.644V6.30776ZM136.16 10.8241C135.752 11.2222 135.253 11.4059 134.663 11.4059C134.088 11.4059 133.589 11.2069 133.196 10.8241C132.788 10.4108 132.591 9.92085 132.591 9.3544C132.591 8.78793 132.788 8.29803 133.196 7.89997C133.604 7.4866 134.088 7.28758 134.663 7.28758C135.268 7.28758 135.767 7.4866 136.16 7.89997C136.583 8.29803 136.795 8.78793 136.795 9.3544C136.795 9.92085 136.583 10.4108 136.16 10.8241ZM145.99 5.26662L148.168 9.18591L149.634 5.23601H151.994L148.636 13.9625L145.99 9.21654L143.343 13.9625L140.001 5.23601H142.361L143.812 9.18591L145.99 5.26662ZM155.956 5.03701C154.716 5.03701 153.672 5.43505 152.855 6.23115C152.054 7.01195 151.646 8.05301 151.646 9.33903V9.41558C151.646 10.7016 152.054 11.7427 152.855 12.5235C153.687 13.2889 154.746 13.687 156.077 13.687C157.317 13.687 158.33 13.442 159.101 12.9368V10.8088C158.345 11.3446 157.377 11.6049 156.213 11.6049C154.942 11.6049 154.111 10.9772 154.065 9.99736H160.039C160.069 9.7524 160.084 9.47683 160.084 9.20125C160.084 8.0224 159.691 7.04258 158.935 6.24648C158.179 5.43505 157.165 5.03701 155.956 5.03701ZM154.065 8.42046C154.08 8.0377 154.277 7.71619 154.64 7.45593C155.018 7.19566 155.441 7.05789 155.956 7.05789C156.908 7.05789 157.649 7.68558 157.649 8.42046H154.065ZM165.816 5.08297C166.965 5.08297 167.933 5.49634 168.689 6.32307C169.46 7.14979 169.853 8.14493 169.853 9.33907C169.853 10.5332 169.46 11.5437 168.689 12.3857C167.933 13.1971 166.965 13.6105 165.816 13.6105C164.591 13.6105 163.638 13.1053 163.396 12.3857V13.4727H160.991V2.06696H163.396V6.30776C163.638 5.58819 164.591 5.08297 165.816 5.08297ZM165.377 11.4059C165.952 11.4059 166.436 11.2222 166.844 10.8241C167.252 10.4108 167.449 9.92085 167.449 9.3544C167.449 8.78793 167.252 8.29801 166.844 7.89997C166.451 7.4866 165.952 7.28758 165.377 7.28758C164.787 7.28758 164.288 7.4866 163.865 7.89997C163.456 8.29801 163.245 8.78793 163.245 9.3544C163.245 9.92085 163.456 10.4108 163.865 10.8241C164.273 11.2069 164.772 11.4059 165.377 11.4059Z" fill="currentColor"/>
<path d="M89.8362 0.333008C89.988 0.364561 90.1313 0.428355 90.2565 0.520089C90.3966 0.630998 90.5038 0.778018 90.5669 0.945385C90.9647 1.94075 91.3625 2.9355 91.7603 3.92966C92.2006 5.03532 92.6431 6.14117 93.0877 7.24722C93.3194 7.82711 93.55 8.4076 93.7853 8.9863C93.8354 9.10466 93.8612 9.23191 93.8612 9.36046C93.8612 9.48901 93.8354 9.61626 93.7853 9.73462L91.7633 14.7786C91.6295 15.1125 91.3869 15.32 91.0303 15.3741C90.5867 15.4409 90.1898 15.222 90.0296 14.8327C89.6501 13.8997 89.2791 12.9637 88.9051 12.0283L87.0032 7.27007C86.4401 5.85803 85.8762 4.4464 85.3114 3.03517C85.1241 2.56656 84.9428 2.09555 84.7471 1.63055C84.6932 1.50411 84.6677 1.36735 84.6724 1.22995C84.6772 1.09255 84.712 0.957863 84.7744 0.835438C84.8368 0.713012 84.9254 0.605838 85.0337 0.52151C85.1421 0.437179 85.2677 0.377755 85.4015 0.347445C85.4177 0.343836 85.4333 0.33782 85.4489 0.333008H89.8362Z" fill="url(#paint0_linear_208_15)"/>
<path d="M81.9564 0.333008C82.0062 0.346844 82.0561 0.358875 82.1047 0.375718C82.2313 0.415281 82.3474 0.482777 82.4446 0.57324C82.5417 0.663706 82.6174 0.774838 82.666 0.898465C83.1003 1.97644 83.5325 3.05522 83.9628 4.13481C84.3982 5.2232 84.8337 6.31181 85.2691 7.4006C85.482 7.93438 85.696 8.46795 85.9109 9.00134C85.959 9.11556 85.9838 9.23828 85.9838 9.36226C85.9838 9.48624 85.959 9.60897 85.9109 9.7232C85.6707 10.3223 85.4306 10.9213 85.1905 11.52C84.7502 12.616 84.31 13.7121 83.8697 14.8081C83.8006 14.9787 83.6824 15.125 83.5302 15.2282C83.378 15.3315 83.1986 15.3871 83.0148 15.388C82.8201 15.3914 82.6291 15.3345 82.4679 15.225C82.3067 15.1155 82.1832 14.9587 82.1143 14.7762C81.7073 13.7433 81.2918 12.7135 80.88 11.6824C80.3281 10.2864 79.7734 8.89144 79.2158 7.49746C78.6483 6.0786 78.081 4.65954 77.5139 3.2403C77.2989 2.70311 77.0858 2.16473 76.8679 1.62814C76.7727 1.40457 76.768 1.15263 76.855 0.925706C76.942 0.698779 77.1137 0.514681 77.3337 0.412412C77.4136 0.380081 77.4956 0.353544 77.5793 0.333008H81.9564Z" fill="url(#paint1_linear_208_15)"/>
<path d="M101.588 9.50617C101.468 9.91224 101.288 10.2954 101.135 10.687C100.692 11.8011 100.246 12.9146 99.7983 14.0274C99.6956 14.2825 99.5912 14.5369 99.4916 14.7932C99.4214 14.9683 99.3003 15.1183 99.1442 15.2237C98.9881 15.3292 98.804 15.3853 98.6156 15.3847C98.4273 15.3841 98.2436 15.3269 98.0881 15.2205C97.9326 15.1141 97.8124 14.9633 97.7434 14.7878L95.7994 9.92605L94.1185 5.72664C93.5698 4.35552 93.0215 2.98458 92.4735 1.61385C92.4214 1.48852 92.3974 1.35326 92.4032 1.21761C92.4089 1.08196 92.4443 0.949232 92.5068 0.828775C92.5693 0.708318 92.6574 0.603069 92.765 0.520448C92.8725 0.437828 92.9968 0.37985 93.1291 0.350601C93.1471 0.346391 93.1645 0.340375 93.1825 0.334961H97.5699C97.5836 0.339172 97.5969 0.344586 97.6108 0.347594C97.7646 0.379769 97.9079 0.450334 98.0273 0.552752C98.1467 0.655171 98.2385 0.78613 98.2938 0.933503C98.5493 1.57515 98.805 2.215 99.0612 2.85305C99.7316 4.52856 100.401 6.20407 101.071 7.87958C101.246 8.32113 101.442 8.75485 101.586 9.20842L101.588 9.50617Z" fill="url(#paint2_linear_208_15)"/>
</g>
<path d="M0.788497 15.9577V6.16183H2.73655V7.35849H2.82468C2.91126 7.16678 3.03649 6.97197 3.20037 6.77407C3.36735 6.57308 3.5838 6.40611 3.84972 6.27315C4.11874 6.13709 4.45269 6.06906 4.85158 6.06906C5.37106 6.06906 5.85034 6.20512 6.28942 6.47723C6.72851 6.74624 7.07947 7.15286 7.3423 7.69708C7.60513 8.2382 7.73655 8.91693 7.73655 9.73326C7.73655 10.5279 7.60823 11.1989 7.35158 11.7462C7.09802 12.2905 6.7517 12.7033 6.31262 12.9846C5.87662 13.2629 5.38806 13.4021 4.84694 13.4021C4.46351 13.4021 4.13729 13.3387 3.86827 13.2119C3.60235 13.0851 3.38435 12.9259 3.21429 12.7342C3.04422 12.5394 2.91435 12.343 2.82468 12.1451H2.76438V15.9577H0.788497ZM2.72263 9.72398C2.72263 10.1476 2.78139 10.5171 2.89889 10.8325C3.01639 11.1479 3.18646 11.3937 3.40909 11.57C3.63173 11.7432 3.90229 11.8297 4.22078 11.8297C4.54236 11.8297 4.81447 11.7416 5.03711 11.5654C5.25974 11.386 5.42826 11.1386 5.54267 10.8232C5.66017 10.5047 5.71892 10.1383 5.71892 9.72398C5.71892 9.31273 5.66172 8.95094 5.54731 8.63864C5.4329 8.32633 5.26438 8.08205 5.04174 7.9058C4.81911 7.72955 4.54545 7.64142 4.22078 7.64142C3.8992 7.64142 3.62709 7.72645 3.40445 7.89652C3.18491 8.06659 3.01639 8.30778 2.89889 8.62008C2.78139 8.93239 2.72263 9.30036 2.72263 9.72398ZM11.8809 13.4253C11.1604 13.4253 10.5374 13.2722 10.0117 12.9661C9.48912 12.6569 9.08559 12.2271 8.80111 11.6767C8.51664 11.1232 8.3744 10.4816 8.3744 9.75181C8.3744 9.01588 8.51664 8.37271 8.80111 7.82231C9.08559 7.26882 9.48912 6.83901 10.0117 6.53289C10.5374 6.22367 11.1604 6.06906 11.8809 6.06906C12.6014 6.06906 13.2229 6.22367 13.7455 6.53289C14.2711 6.83901 14.6762 7.26882 14.9607 7.82231C15.2451 8.37271 15.3874 9.01588 15.3874 9.75181C15.3874 10.4816 15.2451 11.1232 14.9607 11.6767C14.6762 12.2271 14.2711 12.6569 13.7455 12.9661C13.2229 13.2722 12.6014 13.4253 11.8809 13.4253ZM11.8902 11.8947C12.2179 11.8947 12.4916 11.8019 12.7111 11.6164C12.9307 11.4278 13.0961 11.1711 13.2074 10.8464C13.3218 10.5218 13.379 10.1522 13.379 9.7379C13.379 9.32355 13.3218 8.95404 13.2074 8.62936C13.0961 8.30469 12.9307 8.04804 12.7111 7.85942C12.4916 7.6708 12.2179 7.57649 11.8902 7.57649C11.5593 7.57649 11.281 7.6708 11.0553 7.85942C10.8327 8.04804 10.6641 8.30469 10.5497 8.62936C10.4384 8.95404 10.3827 9.32355 10.3827 9.7379C10.3827 10.1522 10.4384 10.5218 10.5497 10.8464C10.6641 11.1711 10.8327 11.4278 11.0553 11.6164C11.281 11.8019 11.5593 11.8947 11.8902 11.8947ZM17.5071 13.2861L15.5684 6.16183H17.5674L18.6713 10.9485H18.7363L19.8865 6.16183H21.8485L23.0173 10.9206H23.0776L24.163 6.16183H26.1574L24.2233 13.2861H22.1314L20.907 8.80561H20.8188L19.5943 13.2861H17.5071ZM29.8878 13.4253C29.155 13.4253 28.5242 13.2769 27.9954 12.98C27.4697 12.6801 27.0647 12.2564 26.7802 11.7091C26.4957 11.1587 26.3535 10.5078 26.3535 9.75645C26.3535 9.02361 26.4957 8.38044 26.7802 7.82695C27.0647 7.27346 27.4651 6.8421 27.9815 6.53289C28.501 6.22367 29.1101 6.06906 29.8089 6.06906C30.279 6.06906 30.7165 6.14482 31.1216 6.29634C31.5297 6.44476 31.8853 6.66894 32.1884 6.96888C32.4945 7.26882 32.7326 7.64606 32.9026 8.1006C33.0727 8.55206 33.1577 9.08081 33.1577 9.68687V10.2295H27.142V9.00506H31.2978C31.2978 8.72058 31.236 8.46857 31.1123 8.24903C30.9886 8.02948 30.817 7.85787 30.5974 7.73418C30.381 7.60741 30.129 7.54402 29.8414 7.54402C29.5415 7.54402 29.2756 7.61359 29.0436 7.75274C28.8148 7.88879 28.6355 8.07277 28.5056 8.30469C28.3757 8.5335 28.3093 8.78861 28.3062 9.06999V10.2342C28.3062 10.5867 28.3711 10.8913 28.501 11.1479C28.6339 11.4046 28.821 11.6025 29.0622 11.7416C29.3034 11.8808 29.5894 11.9503 29.9203 11.9503C30.1398 11.9503 30.3408 11.9194 30.5232 11.8576C30.7057 11.7957 30.8618 11.703 30.9917 11.5793C31.1216 11.4556 31.2205 11.3041 31.2885 11.1247L33.116 11.2453C33.0232 11.6844 32.8331 12.0678 32.5455 12.3956C32.261 12.7203 31.8931 12.9738 31.4416 13.1563C30.9932 13.3356 30.4753 13.4253 29.8878 13.4253ZM34.0553 13.2861V6.16183H35.9709V7.40487H36.0451C36.175 6.96269 36.393 6.62874 36.6991 6.40302C37.0052 6.1742 37.3577 6.05979 37.7566 6.05979C37.8556 6.05979 37.9623 6.06597 38.0767 6.07834C38.1911 6.09071 38.2916 6.10772 38.3782 6.12936V7.88261C38.2854 7.85478 38.1571 7.83004 37.9932 7.8084C37.8293 7.78675 37.6793 7.77593 37.5433 7.77593C37.2526 7.77593 36.9929 7.83932 36.7641 7.9661C36.5383 8.08978 36.359 8.26294 36.226 8.48558C36.0961 8.70821 36.0312 8.96486 36.0312 9.25552V13.2861H34.0553ZM41.923 13.4253C41.1902 13.4253 40.5594 13.2769 40.0306 12.98C39.5049 12.6801 39.0999 12.2564 38.8154 11.7091C38.5309 11.1587 38.3887 10.5078 38.3887 9.75645C38.3887 9.02361 38.5309 8.38044 38.8154 7.82695C39.0999 7.27346 39.5003 6.8421 40.0167 6.53289C40.5362 6.22367 41.1453 6.06906 41.8442 6.06906C42.3142 6.06906 42.7517 6.14482 43.1568 6.29634C43.5649 6.44476 43.9205 6.66894 44.2236 6.96888C44.5297 7.26882 44.7678 7.64606 44.9378 8.1006C45.1079 8.55206 45.1929 9.08081 45.1929 9.68687V10.2295H39.1772V9.00506H43.333C43.333 8.72058 43.2712 8.46857 43.1475 8.24903C43.0238 8.02948 42.8522 7.85787 42.6327 7.73418C42.4162 7.60741 42.1642 7.54402 41.8766 7.54402C41.5767 7.54402 41.3108 7.61359 41.0788 7.75274C40.85 7.88879 40.6707 8.07277 40.5408 8.30469C40.4109 8.5335 40.3445 8.78861 40.3414 9.06999V10.2342C40.3414 10.5867 40.4063 10.8913 40.5362 11.1479C40.6691 11.4046 40.8562 11.6025 41.0974 11.7416C41.3386 11.8808 41.6246 11.9503 41.9555 11.9503C42.175 11.9503 42.376 11.9194 42.5584 11.8576C42.7409 11.7957 42.897 11.703 43.0269 11.5793C43.1568 11.4556 43.2557 11.3041 43.3237 11.1247L45.1512 11.2453C45.0584 11.6844 44.8683 12.0678 44.5807 12.3956C44.2962 12.7203 43.9283 12.9738 43.4768 13.1563C43.0284 13.3356 42.5105 13.4253 41.923 13.4253ZM48.7158 13.4021C48.1746 13.4021 47.6845 13.2629 47.2455 12.9846C46.8095 12.7033 46.4631 12.2905 46.2065 11.7462C45.9529 11.1989 45.8262 10.5279 45.8262 9.73326C45.8262 8.91693 45.9576 8.2382 46.2204 7.69708C46.4832 7.15286 46.8327 6.74624 47.2686 6.47723C47.7077 6.20512 48.1886 6.06906 48.7111 6.06906C49.11 6.06906 49.4424 6.13709 49.7083 6.27315C49.9774 6.40611 50.1938 6.57308 50.3577 6.77407C50.5247 6.97197 50.6515 7.16678 50.738 7.35849H50.7983V3.78706H52.7696V13.2861H50.8215V12.1451H50.738C50.6453 12.343 50.5139 12.5394 50.3438 12.7342C50.1768 12.9259 49.9588 13.0851 49.6898 13.2119C49.4239 13.3387 49.0992 13.4021 48.7158 13.4021ZM49.3419 11.8297C49.6604 11.8297 49.9294 11.7432 50.149 11.57C50.3716 11.3937 50.5417 11.1479 50.6592 10.8325C50.7798 10.5171 50.8401 10.1476 50.8401 9.72398C50.8401 9.30036 50.7813 8.93239 50.6638 8.62008C50.5463 8.30778 50.3763 8.06659 50.1536 7.89652C49.931 7.72645 49.6604 7.64142 49.3419 7.64142C49.0173 7.64142 48.7436 7.72955 48.521 7.9058C48.2983 8.08205 48.1298 8.32633 48.0154 8.63864C47.901 8.95094 47.8438 9.31273 47.8438 9.72398C47.8438 10.1383 47.901 10.5047 48.0154 10.8232C48.1329 11.1386 48.3014 11.386 48.521 11.5654C48.7436 11.7416 49.0173 11.8297 49.3419 11.8297ZM56.6705 13.2861V3.78706H58.6464V7.35849H58.7067C58.7933 7.16678 58.9185 6.97197 59.0824 6.77407C59.2493 6.57308 59.4658 6.40611 59.7317 6.27315C60.0007 6.13709 60.3347 6.06906 60.7336 6.06906C61.2531 6.06906 61.7323 6.20512 62.1714 6.47723C62.6105 6.74624 62.9615 7.15286 63.2243 7.69708C63.4871 8.2382 63.6185 8.91693 63.6185 9.73326C63.6185 10.5279 63.4902 11.1989 63.2336 11.7462C62.98 12.2905 62.6337 12.7033 62.1946 12.9846C61.7586 13.2629 61.2701 13.4021 60.7289 13.4021C60.3455 13.4021 60.0193 13.3387 59.7503 13.2119C59.4844 13.0851 59.2664 12.9259 59.0963 12.7342C58.9262 12.5394 58.7963 12.343 58.7067 12.1451H58.6185V13.2861H56.6705ZM58.6046 9.72398C58.6046 10.1476 58.6634 10.5171 58.7809 10.8325C58.8984 11.1479 59.0685 11.3937 59.2911 11.57C59.5137 11.7432 59.7843 11.8297 60.1028 11.8297C60.4244 11.8297 60.6965 11.7416 60.9191 11.5654C61.1417 11.386 61.3103 11.1386 61.4247 10.8232C61.5422 10.5047 61.6009 10.1383 61.6009 9.72398C61.6009 9.31273 61.5437 8.95094 61.4293 8.63864C61.3149 8.32633 61.1464 8.08205 60.9237 7.9058C60.7011 7.72955 60.4275 7.64142 60.1028 7.64142C59.7812 7.64142 59.5091 7.72645 59.2865 7.89652C59.0669 8.06659 58.8984 8.30778 58.7809 8.62008C58.6634 8.93239 58.6046 9.30036 58.6046 9.72398ZM65.5354 15.9577C65.2849 15.9577 65.0499 15.9376 64.8304 15.8975C64.6139 15.8603 64.4346 15.8124 64.2923 15.7537L64.7376 14.2787C64.9695 14.3498 65.1782 14.3885 65.3638 14.3947C65.5524 14.4009 65.7147 14.3576 65.8508 14.2648C65.9899 14.172 66.1028 14.0143 66.1894 13.7917L66.3053 13.4902L63.7497 6.16183H65.8276L67.3025 11.3937H67.3768L68.8656 6.16183H70.9575L68.1884 14.0561C68.0555 14.4395 67.8746 14.7735 67.6458 15.0579C67.4201 15.3455 67.134 15.5666 66.7877 15.7212C66.4414 15.8789 66.0239 15.9577 65.5354 15.9577Z" fill="currentColor"/>
<defs>
<linearGradient id="paint0_linear_208_15" x1="83.9919" y1="1.55536" x2="94.5605" y2="12.1028" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF00A8"/>
<stop offset="1" stop-color="#6200C6"/>
</linearGradient>
<linearGradient id="paint1_linear_208_15" x1="76.1162" y1="1.55175" x2="86.6824" y2="12.0968" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF00A8"/>
<stop offset="1" stop-color="#6200C6"/>
</linearGradient>
<linearGradient id="paint2_linear_208_15" x1="91.7237" y1="1.55069" x2="102.291" y2="12.0963" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF00A8"/>
<stop offset="1" stop-color="#6200C6"/>
</linearGradient>
<clipPath id="clip0_208_15">
<rect width="93.2653" height="15.102" fill="white" transform="translate(76.7344 0.286133)"/>
</clipPath>
</defs>
</svg>
`;
var ethereumIcon = `
  <svg height="100%" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.99902 0.12619V5.20805L9.58065 7.12736L4.99902 0.12619Z" fill="white" fill-opacity="0.602"/>
    <path d="M4.99923 0.12619L0.416992 7.12736L4.99923 5.20805V0.12619Z" fill="white"/>
    <path d="M4.99902 10.4207V13.8737L9.58371 7.92728L4.99902 10.4207Z" fill="white" fill-opacity="0.602"/>
    <path d="M4.99923 13.8737V10.4201L0.416992 7.92728L4.99923 13.8737Z" fill="white"/>
    <path d="M4.99902 9.62134L9.58065 7.12739L4.99902 5.20923V9.62134Z" fill="white" fill-opacity="0.2"/>
    <path d="M0.416992 7.12739L4.99923 9.62134V5.20923L0.416992 7.12739Z" fill="white" fill-opacity="0.602"/>
  </svg>
`;
var polygonIcon = `
  <svg width="100%" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5091 4.05856C10.2585 3.91901 9.9362 3.91901 9.64974 4.05856L7.64453 5.20986L6.28385 5.94251L4.31445 7.09382C4.0638 7.23337 3.74154 7.23337 3.45508 7.09382L1.91536 6.18673C1.66471 6.04718 1.48568 5.76807 1.48568 5.45408V3.70968C1.48568 3.43057 1.62891 3.15147 1.91536 2.97703L3.45508 2.10483C3.70573 1.96527 4.02799 1.96527 4.31445 2.10483L5.85417 3.01192C6.10482 3.15147 6.28385 3.43057 6.28385 3.74457V4.89587L7.64453 4.12833V2.94214C7.64453 2.66304 7.5013 2.38393 7.21484 2.20949L4.35026 0.569752C4.09961 0.4302 3.77734 0.4302 3.49089 0.569752L0.554687 2.24438C0.268229 2.38393 0.125 2.66304 0.125 2.94214V6.22162C0.125 6.50072 0.268229 6.77983 0.554687 6.95427L3.45508 8.59401C3.70573 8.73356 4.02799 8.73356 4.31445 8.59401L6.28385 7.47759L7.64453 6.71005L9.61393 5.59363C9.86458 5.45408 10.1868 5.45408 10.4733 5.59363L12.013 6.46583C12.2637 6.60539 12.4427 6.88449 12.4427 7.19848V8.94289C12.4427 9.22199 12.2995 9.50109 12.013 9.67553L10.5091 10.5477C10.2585 10.6873 9.9362 10.6873 9.64974 10.5477L8.11002 9.67553C7.85937 9.53598 7.68034 9.25688 7.68034 8.94289V7.82647L6.31966 8.59401V9.74531C6.31966 10.0244 6.46289 10.3035 6.74935 10.478L9.64974 12.1177C9.90039 12.2572 10.2227 12.2572 10.5091 12.1177L13.4095 10.478C13.6602 10.3384 13.8392 10.0593 13.8392 9.74531V6.43095C13.8392 6.15184 13.696 5.87274 13.4095 5.6983L10.5091 4.05856Z" fill="white"/>
  </svg>
`;
var binanceIcon = `
  <svg width="100%" height="100%" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.32975 5.90275L7 3.2325L9.67163 5.90413L11.2254 4.35038L7 0.125L2.776 4.349L4.32975 5.90275ZM0.125 7L1.67875 5.44625L3.2325 7L1.67875 8.55375L0.125 7ZM4.32975 8.09725L7 10.7675L9.67163 8.09587L11.2254 9.64894L7 13.875L2.776 9.651L2.77394 9.64894L4.32975 8.09725ZM10.7675 7L12.3212 5.44625L13.875 7L12.3212 8.55375L10.7675 7ZM8.57575 6.99863H8.57713V7L7 8.57713L5.42494 7.00275L5.42219 7L5.42494 6.99794L5.70062 6.72156L5.83469 6.5875L7 5.42288L8.57644 6.99931L8.57575 6.99863Z" fill="white"/>
  </svg>
`;
var fantomIcon = `
  <svg height="100%" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.26613 0.133876C5.46683 0.0457135 5.68592 0 5.90775 0C6.12958 0 6.34867 0.0457135 6.54938 0.133876L10.2679 1.9598C10.3617 1.99893 10.4437 2.05898 10.5068 2.13465C10.5699 2.21033 10.6121 2.29932 10.6298 2.3938H10.6335V11.5637C10.6245 11.6667 10.5857 11.7654 10.5213 11.8495C10.457 11.9336 10.3694 11.9998 10.2679 12.0411L6.54938 13.8656C6.34867 13.9538 6.12958 13.9995 5.90775 13.9995C5.68592 13.9995 5.46683 13.9538 5.26613 13.8656L1.54762 12.0397C1.44724 11.9979 1.36095 11.9313 1.29799 11.8472C1.23504 11.7631 1.19779 11.6646 1.19025 11.5623C1.19025 11.5465 1.19025 11.5332 1.19025 11.522V2.39205C1.20579 2.29767 1.24673 2.20852 1.30923 2.13292C1.37173 2.05733 1.45375 1.99776 1.54762 1.9598L5.26613 0.133876ZM10.0478 7.50898L6.54938 9.22396C6.34872 9.31229 6.12961 9.35809 5.90775 9.35809C5.68589 9.35809 5.46678 9.31229 5.26613 9.22396L1.77525 7.51283V11.5455L5.26613 13.2493C5.43937 13.3471 5.62982 13.4154 5.82863 13.4512L5.9085 13.4558C6.12668 13.4357 6.3373 13.3704 6.525 13.2647L10.05 11.5301V7.50898H10.0478ZM0.585375 11.3642C0.568078 11.6186 0.612957 11.8734 0.716625 12.1093C0.805331 12.2602 0.936232 12.3857 1.09538 12.4726L1.10662 12.4796C1.1505 12.5069 1.1985 12.5356 1.25663 12.5692L1.32563 12.6081L1.53675 12.7267L1.23375 13.1922L0.9975 13.0592L0.95775 13.0365C0.889125 12.9973 0.8325 12.9637 0.779625 12.9315C0.214875 12.5769 0.004125 12.1912 0 11.3887V11.3642H0.585H0.585375ZM5.61412 5.05096C5.58845 5.05933 5.5634 5.06926 5.53912 5.08071L1.82137 6.90524L1.81013 6.91119H1.80675L1.81275 6.91469L1.82137 6.91889L5.53988 8.74341C5.56405 8.75505 5.58912 8.76499 5.61487 8.77316L5.61412 5.05096ZM6.201 5.05096V8.77456C6.22675 8.76639 6.25182 8.75645 6.276 8.74481L9.9945 6.92029L10.0057 6.91434H10.0091L10.0031 6.91154L9.9945 6.90699L6.276 5.08246C6.25182 5.07083 6.22675 5.06088 6.201 5.05271V5.05096ZM10.0478 3.04479L6.71025 4.68137L10.0478 6.31795V3.04304V3.04479ZM1.77525 3.04864V6.3141L5.103 4.68137L1.77525 3.04864ZM6.27525 0.61617C6.15894 0.569406 6.03364 0.545286 5.907 0.545286C5.78036 0.545286 5.65506 0.569406 5.53875 0.61617L1.821 2.4393L1.80975 2.4449L1.80638 2.44665L1.81238 2.4498L1.821 2.45365L5.5395 4.27817C5.65571 4.32526 5.78106 4.34956 5.90775 4.34956C6.03444 4.34956 6.15979 4.32526 6.276 4.27817L9.9945 2.45365L10.0057 2.4498L10.0091 2.44805L10.0031 2.4449L9.9945 2.4407L6.27525 0.61617ZM10.5968 0.816717L10.833 0.949365L10.875 0.970015C10.9432 1.00921 10.9999 1.04316 11.0528 1.07501C11.6179 1.42851 11.8282 1.81455 11.8328 2.61709V2.64159H11.2459C11.2632 2.38703 11.2183 2.13212 11.1146 1.8961C11.0258 1.74528 10.8948 1.61983 10.7355 1.53316L10.7242 1.52616C10.6807 1.49851 10.6327 1.47016 10.5743 1.43656L10.5056 1.39981L10.2945 1.28151L10.5975 0.816017L10.5968 0.816717Z" fill="white"/>
  </svg>
`;
var optimismIcon = `
  <svg width="100%" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33611 9.25254C2.38341 9.25254 1.60287 9.02834 0.99442 8.58002C0.393974 8.1237 0.09375 7.47526 0.09375 6.63462C0.09375 6.45849 0.113782 6.2423 0.153782 5.9861C0.257909 5.40972 0.406006 4.71718 0.598133 3.9086C1.14252 1.707 2.54757 0.606201 4.81323 0.606201C5.42967 0.606201 5.98206 0.710266 6.47044 0.918394C6.95882 1.11852 7.34308 1.42278 7.62327 1.8311C7.90346 2.23135 8.04362 2.71174 8.04362 3.27212C8.04362 3.44025 8.02359 3.65241 7.98352 3.9086C7.86346 4.62111 7.71933 5.31366 7.55121 5.9861C7.27101 7.08294 6.78666 7.90354 6.09815 8.44793C5.40964 8.98431 4.489 9.25254 3.33611 9.25254ZM3.50424 7.52326C3.95262 7.52326 4.33284 7.39116 4.6451 7.12697C4.96535 6.86278 5.19351 6.45849 5.32958 5.9141C5.51371 5.16153 5.65387 4.50502 5.74993 3.94463C5.78193 3.7765 5.79793 3.60441 5.79793 3.42822C5.79793 2.6997 5.41764 2.33542 4.65713 2.33542C4.20875 2.33542 3.82449 2.46751 3.50424 2.7317C3.19205 2.99596 2.96786 3.40025 2.83179 3.94463C2.68766 4.48102 2.54354 5.13753 2.39947 5.9141C2.36741 6.07417 2.35141 6.2423 2.35141 6.41842C2.35141 7.155 2.73573 7.52326 3.50424 7.52326Z" fill="white"/>
    <path d="M8.59569 9.13247C8.50762 9.13247 8.43953 9.10443 8.39153 9.04837C8.35146 8.98431 8.33949 8.9123 8.35549 8.83224L10.0127 1.02648C10.0287 0.938417 10.0727 0.866353 10.1448 0.810289C10.2169 0.754289 10.2929 0.726257 10.373 0.726257H13.5673C14.456 0.726257 15.1685 0.910385 15.7049 1.27864C16.2493 1.64696 16.5215 2.17931 16.5215 2.87582C16.5215 3.07595 16.4975 3.28415 16.4495 3.50027C16.2493 4.42098 15.845 5.10149 15.2366 5.54181C14.6361 5.98213 13.8115 6.20229 12.7627 6.20229H11.1415L10.5892 8.83224C10.5731 8.92031 10.5291 8.99231 10.4571 9.04837C10.385 9.10443 10.3089 9.13247 10.2289 9.13247H8.59569ZM12.8468 4.54507C13.183 4.54507 13.4752 4.45298 13.7234 4.26885C13.9796 4.08472 14.1478 3.82053 14.2278 3.47627C14.2518 3.34015 14.2639 3.22008 14.2639 3.11602C14.2639 2.88383 14.1958 2.7077 14.0597 2.58763C13.9236 2.45951 13.6914 2.3955 13.3632 2.3955H11.9221L11.4658 4.54507H12.8468Z" fill="white"/>
  </svg>
`;
var avalancheIcon = `
  <svg width="100%" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.8682 0.489349H0.110352V18.4468H19.8682V0.489349Z" fill="white"/>
  </svg>
`;
var celoIcon = `
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 26.3.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Symbol" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 384 383" style="enable-background:new 0 0 384 383;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#FCFF52;}
</style>
<path class="st0" d="M383.5,0H0.5v383h383V249.3h-63.6C298,298.1,248.7,332,192.3,332c-77.8,0-140.8-63.6-140.8-140.8
	C51.4,114,114.5,51,192.3,51c57.5,0,106.8,35,128.7,84.9h62.5V0z"/>
</svg>
`;
var gnosisIcon = `
  <svg width="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z" fill="#04795B"/>
    <path d="M11.6529 17.4492C12.2831 17.4492 12.8648 17.2392 13.3334 16.8758L9.4877 13.0316C9.12413 13.4919 8.9141 14.0734 8.9141 14.7114C8.906 16.2216 10.134 17.4492 11.6529 17.4492Z" fill="#EFEFEF"/>
    <path d="M23.0931 14.7033C23.0931 14.0734 22.8831 13.4919 22.5195 13.0234L18.6738 16.8677C19.1343 17.2311 19.716 17.4411 20.3543 17.4411C21.8651 17.4492 23.0931 16.2216 23.0931 14.7033Z" fill="#EFEFEF"/>
    <path d="M25.0322 10.528L23.3275 12.2321C23.8931 12.9105 24.2324 13.7666 24.2324 14.7195C24.2324 16.8597 22.4954 18.5961 20.3544 18.5961C19.4092 18.5961 18.5447 18.2569 17.866 17.6915L15.9998 19.5571L14.1335 17.6915C13.4549 18.2569 12.5985 18.5961 11.6451 18.5961C9.50416 18.5961 7.7672 16.8597 7.7672 14.7195C7.7672 13.7746 8.10651 12.9105 8.67206 12.2321L7.79947 11.3599L6.96736 10.528C5.99787 12.1271 5.44043 13.9927 5.44043 15.9956C5.44043 21.8265 10.1667 26.543 15.9917 26.543C21.8167 26.543 26.543 21.8185 26.543 15.9956C26.5591 13.9846 26.0017 12.119 25.0322 10.528Z" fill="#EFEFEF"/>
    <path d="M23.6338 8.71084C21.7191 6.6999 19.0045 5.44 15.9991 5.44C12.9937 5.44 10.2872 6.6999 8.36435 8.71084C8.10584 8.98545 7.85539 9.27617 7.62109 9.575L15.991 17.9419L24.361 9.56695C24.1509 9.27617 23.9005 8.97734 23.6338 8.71084ZM15.9991 6.81297C18.4713 6.81297 20.7658 7.76593 22.4866 9.50231L15.9991 15.9874L9.5116 9.50231C11.2405 7.76593 13.5269 6.81297 15.9991 6.81297Z" fill="#EFEFEF"/>
  </svg>
`;
var harmonyOneIcon = `
  <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5484 1.04102e-06C11.6346 -0.000708404 10.7578 0.361217 10.1105 1.00633C9.46322 1.65145 9.09835 2.52703 9.096 3.44089V7.256C8.74045 7.28 8.37689 7.29511 8 7.29511C7.62311 7.29511 7.26133 7.31022 6.904 7.33156V3.44089C6.88946 2.53496 6.51938 1.67105 5.87358 1.03553C5.22779 0.400017 4.35805 0.0438409 3.452 0.0438409C2.54595 0.0438409 1.67621 0.400017 1.03042 1.03553C0.384623 1.67105 0.0145378 2.53496 0 3.44089V12.5591C0.0145378 13.465 0.384623 14.329 1.03042 14.9645C1.67621 15.6 2.54595 15.9562 3.452 15.9562C4.35805 15.9562 5.22779 15.6 5.87358 14.9645C6.51938 14.329 6.88946 13.465 6.904 12.5591V8.744C7.25956 8.72 7.62311 8.70489 8 8.70489C8.37689 8.70489 8.73867 8.68978 9.096 8.66845V12.5591C9.11054 13.465 9.48062 14.329 10.1264 14.9645C10.7722 15.6 11.6419 15.9562 12.548 15.9562C13.4541 15.9562 14.3238 15.6 14.9696 14.9645C15.6154 14.329 15.9855 13.465 16 12.5591V3.44089C15.9976 2.52719 15.6329 1.65173 14.9858 1.00665C14.3387 0.361557 13.4622 -0.000472854 12.5484 1.04102e-06ZM3.45156 1.40978C3.99089 1.40954 4.50828 1.62326 4.89023 2.00404C5.27218 2.38482 5.48748 2.90156 5.48889 3.44089V7.48089C4.47892 7.62724 3.49264 7.90609 2.55556 8.31023C2.14954 8.48842 1.76733 8.71655 1.41778 8.98934V3.44089C1.41919 2.90218 1.634 2.38597 2.01518 2.00529C2.39636 1.62462 2.91284 1.41048 3.45156 1.40978ZM5.48889 12.5591C5.48889 13.0994 5.27424 13.6177 4.89217 13.9997C4.51009 14.3818 3.99189 14.5964 3.45156 14.5964C2.91122 14.5964 2.39302 14.3818 2.01094 13.9997C1.62887 13.6177 1.41422 13.0994 1.41422 12.5591V11.6444C1.41422 10.8364 2.05422 10.0711 3.12711 9.59467C3.88309 9.26852 4.6763 9.03656 5.48889 8.904V12.5591ZM12.5484 14.5902C12.0091 14.5905 11.4917 14.3767 11.1098 13.996C10.7278 13.6152 10.5125 13.0984 10.5111 12.5591V8.51911C11.5211 8.37276 12.5074 8.09392 13.4444 7.68978C13.8505 7.51159 14.2327 7.28345 14.5822 7.01067V12.5591C14.5808 13.0978 14.366 13.614 13.9848 13.9947C13.6036 14.3754 13.0872 14.5895 12.5484 14.5902ZM12.8729 6.4C12.1169 6.72615 11.3237 6.95811 10.5111 7.09067V3.44089C10.5111 2.90056 10.7258 2.38235 11.1078 2.00028C11.4899 1.6182 12.0081 1.40356 12.5484 1.40356C13.0888 1.40356 13.607 1.6182 13.9891 2.00028C14.3711 2.38235 14.5858 2.90056 14.5858 3.44089V4.35556C14.5858 5.16 13.9458 5.92534 12.8729 6.4Z" fill="url(#paint0_linear_10254_2422)"/>
    <defs>
      <linearGradient id="paint0_linear_10254_2422" x1="1.01333" y1="14.7674" x2="14.8954" y2="0.847434" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00AEE9"/>
        <stop offset="1" stop-color="#69FABD"/>
      </linearGradient>
    </defs>
  </svg>
`;
var arbitrumIcon = `
  <svg height="100%" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.7827 11.3172L15.5966 8.23933L20.4858 15.8545L20.4881 17.3159L20.4722 7.25942C20.4606 7.0136 20.3301 6.7887 20.1218 6.6561L11.3194 1.5928C11.1135 1.49162 10.8523 1.49269 10.6468 1.59594C10.6191 1.60989 10.593 1.62499 10.568 1.64147L10.5374 1.66079L1.99318 6.6121L1.95999 6.62712C1.91737 6.64674 1.8743 6.67165 1.83382 6.70063C1.67186 6.81683 1.56424 6.98861 1.52944 7.18131C1.52423 7.21052 1.52039 7.24026 1.51855 7.27023L1.53197 15.4653L6.08607 8.40666C6.65942 7.47067 7.90869 7.1692 9.06835 7.1856L10.4295 7.22155L2.40986 20.0827L3.3552 20.627L11.4709 7.23458L15.0581 7.22155L6.96327 20.9519L10.3366 22.8921L10.7396 23.1239C10.9101 23.1932 11.111 23.1967 11.283 23.1347L20.2091 17.9618L18.5026 18.9507L13.7827 11.3172ZM14.4747 21.2849L11.0677 15.9375L13.1474 12.4083L17.622 19.461L14.4747 21.2849Z" fill="#2D374B"/>
    <path d="M11.0684 15.9375L14.4754 21.2849L17.6228 19.4609L13.1482 12.4083L11.0684 15.9375Z" fill="#28A0F0"/>
    <path d="M20.4887 17.3159L20.4864 15.8545L15.5972 8.23932L13.7832 11.3172L18.5031 18.9507L20.2097 17.9618C20.3771 17.8259 20.4783 17.6264 20.489 17.4111L20.4887 17.3159Z" fill="#28A0F0"/>
    <path d="M7.71943e-05 18.694L2.41 20.0826L10.4296 7.22152L9.0685 7.18557C7.90883 7.16916 6.65964 7.47063 6.08621 8.40662L1.53211 15.4652L0 17.8193V18.694H7.71943e-05Z" fill="white"/>
    <path d="M15.0582 7.22156L11.4712 7.23459L3.35547 20.627L6.19211 22.2603L6.96354 20.9519L15.0582 7.22156Z" fill="white"/>
    <path d="M21.9999 7.20306C21.97 6.45287 21.5638 5.76608 20.9275 5.36626L12.0097 0.237888C11.3803 -0.079066 10.594 -0.0794494 9.96363 0.237658C9.88913 0.275218 1.2912 5.26171 1.2912 5.26171C1.17223 5.31874 1.05764 5.38673 0.949789 5.46384C0.381801 5.87094 0.0355663 6.50346 0 7.19846V17.8194L1.53211 15.4653L1.5187 7.27029C1.52054 7.24032 1.52429 7.21088 1.52958 7.18175C1.56415 6.9889 1.67185 6.81689 1.83397 6.70069C1.87444 6.67171 10.6192 1.60995 10.647 1.596C10.8526 1.49275 11.1137 1.49168 11.3195 1.59286L20.122 6.65616C20.3302 6.78876 20.4608 7.01366 20.4723 7.25948V17.4111C20.4617 17.6265 20.3766 17.8259 20.2092 17.9619L18.5026 18.9508L17.6221 19.461L14.4748 21.285L11.283 23.1347C11.1111 23.1968 10.9101 23.1933 10.7397 23.124L6.96334 20.952L6.19191 22.2603L9.58559 24.2142C9.6978 24.278 9.79784 24.3345 9.87985 24.3807C10.0069 24.452 10.0935 24.4996 10.1241 24.5144C10.3653 24.6315 10.7123 24.6997 11.025 24.6997C11.3118 24.6997 11.5913 24.647 11.8559 24.5434L21.1266 19.1745C21.6587 18.7623 21.9717 18.1406 21.9999 17.467V7.20306Z" fill="#96BEDC"/>
  </svg>
`;
var baseIcon = `
<svg height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1607_202)">
<mask id="mask0_1607_202" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
<path d="M32 0H0V32H32V0Z" fill="white"/>
</mask>
<g mask="url(#mask0_1607_202)">
<path d="M16 32C19.1645 32 22.258 31.0616 24.8892 29.3036C27.5204 27.5454 29.571 25.0466 30.782 22.123C31.993 19.1993 32.31 15.9823 31.6926 12.8786C31.0752 9.77486 29.5514 6.92394 27.3138 4.6863C25.076 2.44866 22.2252 0.924806 19.1214 0.307442C16.0177 -0.30992 12.8007 0.0069325 9.87706 1.21793C6.95344 2.42894 4.45458 4.4797 2.69648 7.11088C0.938384 9.74206 0 12.8355 0 16C0 20.2434 1.68571 24.3132 4.6863 27.3138C7.68688 30.3142 11.7565 32 16 32Z" fill="#0052FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.9624 27.2676C22.1852 27.2676 27.23 22.223 27.23 16C27.23 9.7771 22.1852 4.73242 15.9624 4.73242C10.0588 4.73242 5.21566 9.2726 4.7341 15.0518H21.4546V16.928H4.73242C5.20432 22.7168 10.0519 27.2676 15.9624 27.2676Z" fill="white"/>
</g>
</g>
<defs>
<clipPath id="clip0_1607_202">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>
`;
var hourglass = `
<svg width="100%" height="100%" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0L0.0100002 6L4 10L0.0100002 14.01L0 20H12V14L8 10L12 6.01V0H0ZM10 14.5V18H2V14.5L6 10.5L10 14.5Z" fill="#929BED"/>
</svg>
`;
var questionIcon = `
  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.07 12.85C11.84 11.46 13.32 10.64 14.18 9.41C15.09 8.12 14.58 5.71 12 5.71C10.31 5.71 9.48 6.99 9.13 8.05L6.54 6.96C7.25 4.83 9.18 3 11.99 3C14.34 3 15.95 4.07 16.77 5.41C17.47 6.56 17.88 8.71 16.8 10.31C15.6 12.08 14.45 12.62 13.83 13.76C13.58 14.22 13.48 14.52 13.48 16H10.59C10.58 15.22 10.46 13.95 11.07 12.85ZM14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18C13.1 18 14 18.9 14 20Z" fill="currentColor"/>
  </svg>
`;
var checkmark = `
<svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.48076 8.10881L1.33076 4.95881L0.280762 6.00881L4.48076 10.2088L13.4808 1.20881L12.4308 0.158813L4.48076 8.10881Z" fill="#A4F4C6"/>
</svg>
`;
var errorIcon = `<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.666992 13.0002H15.3337L8.00033 0.333496L0.666992 13.0002ZM8.66699 11.0002H7.33366V9.66683H8.66699V11.0002ZM8.66699 8.3335H7.33366V5.66683H8.66699V8.3335Z" fill="#FFB3B3"/>
</svg>
`;
var infoIcon = `
  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
  </svg>
`;
var successIcon = `
  <svg width="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.74999 12.15L3.59999 9L2.54999 10.05L6.74999 14.25L15.75 5.25L14.7 4.2L6.74999 12.15Z" fill="currentColor"/>
  </svg>
`;
var pendingIcon = `
  <svg width="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2L6.01 8L10 12L6.01 16.01L6 22H18V16L14 12L18 8.01V2H6ZM16 16.5V20H8V16.5L12 12.5L16 16.5Z" fill="currenColor"/>
  </svg>
`;
var degenIcon = `
<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477 477">
  <defs>
    <style>.cls-1{fill:#a36dfe;}.cls-2{fill:#4b2895;}</style>
  </defs>
  <circle class="cls-1" cx="238.5" cy="238.5" r="238.5"/>
  <g>
    <path class="cls-2" d="M237.85,113.99c29.25,1.32,54.97,2.45,80.69,3.69,3.95,.19,7.92,.72,11.82,1.43,9.23,1.69,15.34,8.72,14.78,18.2-1.33,22.33-3.22,44.63-4.79,66.95-.81,11.47-1.49,22.96-2.12,34.44-.29,5.24-2.03,8.14-7.74,10.18-37.84,13.52-76.98,15.46-116.47,13.42-23.24-1.2-45.99-5.86-68.06-13.68-4.71-1.67-6.72-3.91-7.03-8.72-1.31-20.46-2.83-40.9-4.25-61.35-.94-13.55-2.1-27.1-2.7-40.66-.49-11.15,6.17-18.37,17.2-19.01,30.7-1.78,61.4-3.39,88.69-4.88Z"/><path class="cls-2" d="M238.34,363.01c-31.19-1.24-61.52-5.51-90.12-18.31-20.8-9.31-38.13-23.01-48.65-43.63-3.63-7.1-5.68-15.3-6.91-23.24-1.17-7.59,1.95-14.47,8.76-18.93,6.74-4.42,13.4-3.5,20.12,.38,14.24,8.24,14.6,8.18,14.39,24.44-.09,7.1,3.71,11.23,8.41,15.24,12.51,10.67,26.94,17.78,42.7,21.94,38.88,10.26,77.66,10.06,115.42-4.42,11.31-4.33,21.33-12.17,31.67-18.82,5.27-3.39,7.7-8.7,6.88-15.19-1.34-10.7,2.19-17.99,12.86-22.48,7.8-3.29,14.95-6.25,22.38-.72,7.42,5.53,9.4,13.33,7.88,22.37-4.05,24.14-19.06,40.5-38.25,53.68-18.5,12.7-39.59,19.06-61.42,22.61-15.24,2.48-30.72,3.44-46.1,5.09Z"/>
  </g>
</svg>
`;
var snaxIcon = `<svg width="178" height="177" viewBox="0 0 178 177" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="89.0198" cy="88.4095" r="88.305" fill="#06061B"/>
<path d="M68.0815 75.158C67.5149 74.5153 66.8174 74.1932 65.9874 74.1932H49.0126C48.8618 74.1932 48.7384 74.1459 48.6455 74.0512C48.5511 73.9581 48.5039 73.8528 48.5039 73.7398V62.3958C48.5039 62.2828 48.5511 62.179 48.6455 62.0844C48.7384 61.9897 48.8618 61.9424 49.0126 61.9424H66.9499C71.4761 61.9424 75.381 63.7773 78.6629 67.4442L83.0201 72.7185L74.5327 82.9848L68.0815 75.158ZM99.4299 67.3877C102.712 63.7575 106.635 61.9424 111.199 61.9424H129.08C129.231 61.9424 129.344 61.9805 129.42 62.0553C129.495 62.1317 129.533 62.2446 129.533 62.3958V73.7398C129.533 73.8528 129.495 73.9581 129.42 74.0512C129.344 74.1459 129.231 74.1932 129.08 74.1932H112.105C111.275 74.1932 110.578 74.5153 110.011 75.158L97.5064 90.2452L110.068 105.445C110.634 106.051 111.312 106.354 112.105 106.354H129.08C129.231 106.354 129.344 106.401 129.42 106.496C129.495 106.59 129.533 106.714 129.533 106.864V118.208C129.533 118.321 129.495 118.426 129.42 118.519C129.344 118.614 129.231 118.661 129.08 118.661H111.199C106.635 118.661 102.73 116.828 99.4863 113.159L89.0754 100.568L78.6629 113.159C75.381 116.828 71.4578 118.661 66.8936 118.661H49.0126C48.8618 118.661 48.7476 118.614 48.673 118.519C48.5968 118.424 48.5603 118.302 48.5603 118.15V106.806C48.5603 106.693 48.5968 106.589 48.673 106.494C48.7476 106.399 48.8618 106.352 49.0126 106.352H65.9874C66.7793 106.352 67.4768 106.032 68.0815 105.387L80.3595 90.5276L99.4299 67.3877Z" fill="#00D1FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.62306 101.122C1.02459 96.9706 0.714844 92.7262 0.714844 88.4095C0.714844 85.5803 0.84789 82.7823 1.10807 80.0212L11.5198 67.3877C14.8017 63.7575 18.7248 61.9424 23.2891 61.9424H41.1701C41.3209 61.9424 41.4336 61.9805 41.5097 62.0553C41.5844 62.1317 41.6224 62.2446 41.6224 62.3958V73.7398C41.6224 73.8528 41.5844 73.9581 41.5097 74.0512C41.4336 74.1459 41.3209 74.1932 41.1701 74.1932H24.1953C23.3653 74.1932 22.6678 74.5153 22.1012 75.158L9.59627 90.2452L22.1576 105.445C22.7241 106.051 23.4018 106.354 24.1953 106.354H41.1701C41.3209 106.354 41.4336 106.401 41.5097 106.496C41.5844 106.59 41.6224 106.714 41.6224 106.864V118.208C41.6224 118.321 41.5844 118.426 41.5097 118.519C41.4336 118.614 41.3209 118.661 41.1701 118.661H23.2891C18.7248 118.661 14.82 116.828 11.5761 113.159L1.62306 101.122Z" fill="#00D1FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M176.393 101.284C177.007 97.0816 177.325 92.7827 177.325 88.4095C177.325 85.5791 177.192 82.7799 176.931 80.0176L168.27 90.5276L155.992 105.387C155.387 106.032 154.689 106.352 153.898 106.352H136.923C136.772 106.352 136.658 106.399 136.583 106.494C136.507 106.589 136.47 106.693 136.47 106.806V118.15C136.47 118.302 136.507 118.424 136.583 118.519C136.658 118.614 136.772 118.661 136.923 118.661H154.804C159.368 118.661 163.291 116.828 166.573 113.159L176.393 101.284ZM153.898 74.1932C154.728 74.1932 155.425 74.5153 155.992 75.158L162.443 82.9848L170.93 72.7185L166.573 67.4442C163.291 63.7773 159.386 61.9424 154.86 61.9424H136.923C136.772 61.9424 136.649 61.9897 136.556 62.0844C136.461 62.179 136.414 62.2828 136.414 62.3958V73.7398C136.414 73.8528 136.461 73.9581 136.556 74.0512C136.649 74.1459 136.772 74.1932 136.923 74.1932H153.898Z" fill="#00D1FF"/>
</svg>`;
function getDevice() {
  if (typeof window !== "undefined") {
    const parsed = bowser.getParser(window.navigator.userAgent);
    const os = parsed.getOS();
    const browser = parsed.getBrowser();
    const { type } = parsed.getPlatform();
    return {
      type,
      os,
      browser
    };
  } else {
    return {
      type: null,
      os: null,
      browser: null
    };
  }
}
const notNullish = (value) => value != null;
function isSVG(str) {
  return str.includes("<svg");
}
function shortenAddress(add) {
  return `${add.slice(0, 6)}…${add.slice(-4)}`;
}
function shortenDomain(domain) {
  return domain.length > 11 ? `${domain.slice(0, 4)}…${domain.slice(-6)}` : domain;
}
async function copyWalletAddress(text2) {
  try {
    const copy = await navigator.clipboard.writeText(text2);
    return copy;
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}
const toHexString = (val) => typeof val === "number" ? `0x${val.toString(16)}` : val;
function chainIdToHex(chains2) {
  return chains2.map((_a) => {
    var { id } = _a, rest = __rest(_a, ["id"]);
    const hexId = toHexString(id);
    return Object.assign({ id: hexId }, rest);
  });
}
function gweiToWeiHex(gwei) {
  return `0x${(gwei * 1e9).toString(16)}`;
}
const chainIdToLabel = {
  "0x1": "Ethereum",
  "0xaa36a7": "Sepolia",
  "0x38": "Binance",
  "0x89": "Polygon",
  "0xfa": "Fantom",
  "0xa": "OP Mainnet",
  "0x45": "OP Kovan",
  "0xa86a": "Avalanche",
  "0xa4ec": "Celo",
  "0x2105": "Base",
  "0x14a33": "Base Goerli",
  "0x64": "Gnosis",
  "0x63564C40": "Harmony One",
  "0xa4b1": "Arbitrum One",
  "0xa4ba": "Arbitrum Nova",
  "0x27bc86aa": "Degen",
  "0x890": "SNAX"
};
function validEnsChain(chainId) {
  switch (chainId) {
    case "0x1":
    case "0x89":
    case "0xa":
    case "0xa4b1":
    case "0x144":
      return "0x1";
    case "0x5":
      return chainId;
    case "0xaa36a7":
      return chainId;
    default:
      return null;
  }
}
const chainIdToViemENSImport = async (chainId) => {
  switch (chainId) {
    case "0x89":
    case "0xa":
    case "0xa4b1":
    case "0x144":
    case "0x1": {
      const { mainnet } = await import("./index-40a497ea.js");
      return mainnet;
    }
    case "0xaa36a7": {
      const { sepolia } = await import("./index-40a497ea.js");
      return sepolia;
    }
    default:
      return null;
  }
};
const networkToChainId = {
  main: "0x1",
  sepolia: "0xaa36a7",
  xdai: "0x64",
  "bsc-main": "0x38",
  "matic-main": "0x89",
  "fantom-main": "0xfa",
  "matic-mumbai": "0x80001",
  degen: "0x27bc86aa",
  SNAX: "0x890"
};
const chainStyles = {
  "0x1": {
    icon: ethereumIcon,
    color: "#627EEA"
  },
  "0xaa36a7": {
    icon: ethereumIcon,
    color: "#627EEA"
  },
  "0x38": {
    icon: binanceIcon,
    color: "#F3BA2F"
  },
  "0x89": {
    icon: polygonIcon,
    color: "#8247E5"
  },
  "0xfa": {
    icon: fantomIcon,
    color: "#1969FF"
  },
  "0xa": {
    icon: optimismIcon,
    color: "#FF0420"
  },
  "0x45": {
    icon: optimismIcon,
    color: "#FF0420"
  },
  "0xa86a": {
    icon: avalancheIcon,
    color: "#E84142"
  },
  "0xa4ec": {
    icon: celoIcon,
    color: "#FBCC5C"
  },
  "0x64": {
    icon: gnosisIcon,
    color: "#04795B"
  },
  "0x63564C40": {
    icon: harmonyOneIcon,
    color: "#ffffff"
  },
  "0xa4b1": {
    icon: arbitrumIcon,
    color: "#33394B"
  },
  "0xa4ba": {
    icon: arbitrumIcon,
    color: "#33394B"
  },
  "0x2105": {
    icon: baseIcon,
    color: "#0259F9"
  },
  "0x14a33": {
    icon: baseIcon,
    color: "#0259F9"
  },
  "0x80001": {
    icon: polygonIcon,
    color: "#8247E5"
  },
  "0x27bc86aa": {
    icon: degenIcon,
    color: "#a36dfe"
  },
  "0x890": {
    icon: snaxIcon,
    color: "#00D1FF"
  }
};
const unrecognizedChainStyle = { icon: questionIcon, color: "#33394B" };
function getDefaultChainStyles(chainId) {
  return chainId ? chainStyles[chainId.toLowerCase()] : void 0;
}
function connectedToValidAppChain(walletConnectedChain, chains2) {
  return !!chains2.find(({ id, namespace }) => id === walletConnectedChain.id && namespace === walletConnectedChain.namespace);
}
const defaultNotifyEventStyles = {
  pending: {
    backgroundColor: "var(--onboard-primary-700, var(--primary-700))",
    borderColor: "#6370E5",
    eventIcon: hourglass
  },
  success: {
    backgroundColor: "#052E17",
    borderColor: "var(--onboard-success-300, var(--success-300))",
    eventIcon: checkmark
  },
  error: {
    backgroundColor: "#FDB1B11A",
    borderColor: "var(--onboard-danger-300, var(--danger-300))",
    eventIcon: errorIcon
  },
  hint: {
    backgroundColor: "var(--onboard-gray-500, var(--gray-500))",
    borderColor: "var(--onboard-gray-500, var(--gray-500))",
    iconColor: "var(--onboard-gray-100, var(--gray-100))",
    eventIcon: infoIcon
  }
};
const wait$1 = (time) => new Promise((resolve) => setTimeout(resolve, time));
function getLocalStore(key) {
  try {
    const result = localStorage.getItem(key);
    return result;
  } catch (error) {
    return null;
  }
}
function setLocalStore(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    return;
  }
}
function delLocalStore(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    return;
  }
}
let configuration = {
  svelteInstance: null,
  device: getDevice(),
  initialWalletInit: [],
  gas: void 0,
  containerElements: { accountCenter: void 0, connectModal: void 0 },
  unstoppableResolution: void 0,
  wagmi: void 0
};
function updateConfiguration(update2) {
  configuration = Object.assign(Object.assign({}, configuration), update2);
}
const APP_INITIAL_STATE = {
  wallets: [],
  walletModules: [],
  chains: [],
  accountCenter: {
    enabled: true,
    position: "bottomRight",
    expanded: false,
    minimal: true
  },
  notify: {
    enabled: true,
    position: "topRight",
    replacement: {
      gasPriceProbability: {
        speedup: 80,
        cancel: 95
      }
    }
  },
  notifications: [],
  locale: "",
  connect: {
    showSidebar: true,
    disableClose: false
  },
  appMetadata: null,
  wagmiConfig: null
};
const STORAGE_KEYS = {
  TERMS_AGREEMENT: "onboard.js:agreement",
  LAST_CONNECTED_WALLET: "onboard.js:last_connected_wallet"
};
const MOBILE_WINDOW_WIDTH = 768;
const BN_BOOST_RPC_URL = "https://rpc.blocknative.com/boost";
const BN_BOOST_INFO_URL = "https://docs.blocknative.com/blocknative-mev-protection/transaction-boost";
const ADD_CHAINS = "add_chains";
const UPDATE_CHAINS = "update_chains";
const RESET_STORE = "reset_store";
const ADD_WALLET = "add_wallet";
const UPDATE_WALLET = "update_wallet";
const REMOVE_WALLET = "remove_wallet";
const UPDATE_ACCOUNT = "update_account";
const UPDATE_ACCOUNT_CENTER = "update_account_center";
const UPDATE_CONNECT_MODAL = "update_connect_modal";
const SET_WALLET_MODULES = "set_wallet_modules";
const SET_LOCALE = "set_locale";
const UPDATE_NOTIFY = "update_notify";
const ADD_NOTIFICATION = "add_notification";
const REMOVE_NOTIFICATION = "remove_notification";
const UPDATE_ALL_WALLETS = "update_balance";
const UPDATE_APP_METADATA = "update_app_metadata";
const UPDATE_WAGMI_CONFIG = "update_wagmi_config";
function reducer(state2, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_CHAINS:
      return Object.assign(Object.assign({}, state2), { chains: [...state2.chains, ...payload] });
    case UPDATE_CHAINS: {
      const updatedChain = payload;
      const chains2 = state2.chains;
      const index = chains2.findIndex((chain) => chain.id === updatedChain.id);
      chains2[index] = updatedChain;
      return Object.assign(Object.assign({}, state2), { chains: chains2 });
    }
    case ADD_WALLET: {
      const wallet2 = payload;
      const existingWallet = state2.wallets.find(({ label }) => label === wallet2.label);
      return Object.assign(Object.assign({}, state2), { wallets: [
        // add to front of wallets as it is now the primary wallet
        existingWallet || payload,
        // filter out wallet if it already existed
        ...state2.wallets.filter(({ label }) => label !== wallet2.label)
      ] });
    }
    case UPDATE_WALLET: {
      const update2 = payload;
      const { id } = update2, walletUpdate = __rest(update2, ["id"]);
      const updatedWallets = state2.wallets.map((wallet2) => wallet2.label === id ? Object.assign(Object.assign({}, wallet2), walletUpdate) : wallet2);
      return Object.assign(Object.assign({}, state2), { wallets: updatedWallets });
    }
    case REMOVE_WALLET: {
      const update2 = payload;
      return Object.assign(Object.assign({}, state2), { wallets: state2.wallets.filter(({ label }) => label !== update2.id) });
    }
    case UPDATE_ACCOUNT: {
      const update2 = payload;
      const { id, address } = update2, accountUpdate = __rest(update2, ["id", "address"]);
      const updatedWallets = state2.wallets.map((wallet2) => {
        if (wallet2.label === id) {
          wallet2.accounts = wallet2.accounts.map((account2) => {
            if (account2.address === address) {
              return Object.assign(Object.assign({}, account2), accountUpdate);
            }
            return account2;
          });
        }
        return wallet2;
      });
      return Object.assign(Object.assign({}, state2), { wallets: updatedWallets });
    }
    case UPDATE_ALL_WALLETS: {
      const updatedWallets = payload;
      return Object.assign(Object.assign({}, state2), { wallets: updatedWallets });
    }
    case UPDATE_CONNECT_MODAL: {
      const update2 = payload;
      return Object.assign(Object.assign({}, state2), { connect: Object.assign(Object.assign({}, state2.connect), update2) });
    }
    case UPDATE_ACCOUNT_CENTER: {
      const update2 = payload;
      return Object.assign(Object.assign({}, state2), { accountCenter: Object.assign(Object.assign({}, state2.accountCenter), update2) });
    }
    case UPDATE_NOTIFY: {
      const update2 = payload;
      return Object.assign(Object.assign({}, state2), { notify: Object.assign(Object.assign({}, state2.notify), update2) });
    }
    case ADD_NOTIFICATION: {
      const update2 = payload;
      const notificationsUpdate = [...state2.notifications];
      const notificationExistsIndex = notificationsUpdate.findIndex(({ id }) => id === update2.id);
      if (notificationExistsIndex !== -1) {
        notificationsUpdate[notificationExistsIndex] = update2;
      } else {
        notificationsUpdate.unshift(update2);
      }
      return Object.assign(Object.assign({}, state2), { notifications: notificationsUpdate });
    }
    case REMOVE_NOTIFICATION: {
      const id = payload;
      return Object.assign(Object.assign({}, state2), { notifications: state2.notifications.filter((notification) => notification.id !== id) });
    }
    case SET_WALLET_MODULES: {
      return Object.assign(Object.assign({}, state2), { walletModules: payload });
    }
    case SET_LOCALE: {
      $locale.set(payload);
      return Object.assign(Object.assign({}, state2), { locale: payload });
    }
    case UPDATE_APP_METADATA: {
      const update2 = payload;
      return Object.assign(Object.assign({}, state2), { appMetadata: Object.assign(Object.assign(Object.assign({}, state2.appMetadata), update2), { name: update2.name || "" }) });
    }
    case UPDATE_WAGMI_CONFIG: {
      const update2 = payload;
      return Object.assign(Object.assign({}, state2), { wagmiConfig: update2 });
    }
    case RESET_STORE:
      return APP_INITIAL_STATE;
    default:
      throw new Error(`Unknown type: ${type} in appStore reducer`);
  }
}
const _store = new BehaviorSubject(APP_INITIAL_STATE);
const _stateUpdates = new Subject();
_stateUpdates.subscribe(_store);
function dispatch$1(action) {
  const state2 = _store.getValue();
  _stateUpdates.next(reducer(state2, action));
}
function select(stateKey) {
  if (!stateKey)
    return _stateUpdates.asObservable();
  const validStateKeys = Object.keys(_store.getValue());
  if (!validStateKeys.includes(String(stateKey))) {
    throw new Error(`key: ${stateKey} does not exist on this store`);
  }
  return _stateUpdates.asObservable().pipe(distinctUntilKeyChanged(stateKey), pluck(stateKey), filter(notNullish));
}
function get() {
  return _store.getValue();
}
const state = {
  select,
  get
};
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function is_promise(value) {
  return !!value && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function split_css_unit(value) {
  const split = typeof value === "string" && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return split ? [parseFloat(split[1]), split[2] || "px"] : [value, "px"];
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options2) {
  node.addEventListener(event, handler, options2);
  return () => node.removeEventListener(event, handler, options2);
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = data;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, "");
  }
}
function select_option(select2, value, mounting) {
  for (let i = 0; i < select2.options.length; i += 1) {
    const option = select2.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  {
    select2.selectedIndex = -1;
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
class HtmlTag {
  constructor(is_svg = false) {
    this.is_svg = false;
    this.is_svg = is_svg;
    this.e = this.n = null;
  }
  c(html) {
    this.h(html);
  }
  m(html, target, anchor = null) {
    if (!this.e) {
      if (this.is_svg)
        this.e = svg_element(target.nodeName);
      else
        this.e = element(target.nodeType === 11 ? "TEMPLATE" : target.nodeName);
      this.t = target.tagName !== "TEMPLATE" ? target : target.content;
      this.c(html);
    }
    this.i(anchor);
  }
  h(html) {
    this.e.innerHTML = html;
    this.n = Array.from(this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes);
  }
  i(anchor) {
    for (let i = 0; i < this.n.length; i += 1) {
      insert(this.t, this.n[i], anchor);
    }
  }
  p(html) {
    this.d();
    this.h(html);
    this.i(this.a);
  }
  d() {
    this.n.forEach(detach);
  }
}
function construct_svelte_component(component, props) {
  return new component(props);
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    // remove all Svelte animations
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
    });
    managed_styles.clear();
  });
}
function create_animation(node, from, fn, params) {
  if (!from)
    return noop;
  const to = node.getBoundingClientRect();
  if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
    return noop;
  const {
    delay = 0,
    duration = 300,
    easing = identity,
    // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
    start: start_time = now() + delay,
    // @ts-ignore todo:
    end = start_time + duration,
    tick = noop,
    css: css2
  } = fn(node, { from, to }, params);
  let running = true;
  let started = false;
  let name;
  function start() {
    if (css2) {
      name = create_rule(node, 0, 1, duration, delay, easing, css2);
    }
    if (!delay) {
      started = true;
    }
  }
  function stop() {
    if (css2)
      delete_rule(node, name);
    running = false;
  }
  loop((now2) => {
    if (!started && now2 >= start_time) {
      started = true;
    }
    if (started && now2 >= end) {
      tick(1, 0);
      stop();
    }
    if (!running) {
      return false;
    }
    if (started) {
      const p = now2 - start_time;
      const t = 0 + 1 * easing(p / duration);
      tick(t, 1 - t);
    }
    return true;
  });
  start();
  tick(0, 1);
  return stop;
}
function fix_position(node) {
  const style = getComputedStyle(node);
  if (style.position !== "absolute" && style.position !== "fixed") {
    const { width, height } = style;
    const a = node.getBoundingClientRect();
    node.style.position = "absolute";
    node.style.width = width;
    node.style.height = height;
    add_transform(node, a);
  }
}
function add_transform(node, a) {
  const b = node.getBoundingClientRect();
  if (a.left !== b.left || a.top !== b.top) {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;
    node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
  }
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function beforeUpdate(fn) {
  get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  const options2 = { direction: "in" };
  let config = fn(node, params, options2);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css: css2 } = config || null_transition;
    if (css2)
      animation_name = create_rule(node, 0, 1, duration, delay, easing, css2, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(t, 1 - t);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started)
        return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config(options2);
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  const options2 = { direction: "out" };
  let config = fn(node, params, options2);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css: css2 } = config || null_transition;
    if (css2)
      animation_name = create_rule(node, 1, 0, duration, delay, easing, css2);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config(options2);
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name)
          delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function create_bidirectional_transition(node, fn, params, intro) {
  const options2 = { direction: "both" };
  let config = fn(node, params, options2);
  let t = intro ? 0 : 1;
  let running_program = null;
  let pending_program = null;
  let animation_name = null;
  function clear_animation() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function init2(program, duration) {
    const d = program.b - t;
    duration *= Math.abs(d);
    return {
      a: t,
      b: program.b,
      d,
      duration,
      start: program.start,
      end: program.start + duration,
      group: program.group
    };
  }
  function go(b) {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css: css2 } = config || null_transition;
    const program = {
      start: now() + delay,
      b
    };
    if (!b) {
      program.group = outros;
      outros.r += 1;
    }
    if (running_program || pending_program) {
      pending_program = program;
    } else {
      if (css2) {
        clear_animation();
        animation_name = create_rule(node, t, b, duration, delay, easing, css2);
      }
      if (b)
        tick(0, 1);
      running_program = init2(program, duration);
      add_render_callback(() => dispatch(node, b, "start"));
      loop((now2) => {
        if (pending_program && now2 > pending_program.start) {
          running_program = init2(pending_program, duration);
          pending_program = null;
          dispatch(node, running_program.b, "start");
          if (css2) {
            clear_animation();
            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
          }
        }
        if (running_program) {
          if (now2 >= running_program.end) {
            tick(t = running_program.b, 1 - t);
            dispatch(node, running_program.b, "end");
            if (!pending_program) {
              if (running_program.b) {
                clear_animation();
              } else {
                if (!--running_program.group.r)
                  run_all(running_program.group.c);
              }
            }
            running_program = null;
          } else if (now2 >= running_program.start) {
            const p = now2 - running_program.start;
            t = running_program.a + running_program.d * easing(p / running_program.duration);
            tick(t, 1 - t);
          }
        }
        return !!(running_program || pending_program);
      });
    }
  }
  return {
    run(b) {
      if (is_function(config)) {
        wait().then(() => {
          config = config(options2);
          go(b);
        });
      } else {
        go(b);
      }
    },
    end() {
      clear_animation();
      running_program = pending_program = null;
    }
  };
}
function handle_promise(promise2, info) {
  const token = info.token = {};
  function update2(type, index, key, value) {
    if (info.token !== token)
      return;
    info.resolved = value;
    let child_ctx = info.ctx;
    if (key !== void 0) {
      child_ctx = child_ctx.slice();
      child_ctx[key] = value;
    }
    const block = type && (info.current = type)(child_ctx);
    let needs_flush = false;
    if (info.block) {
      if (info.blocks) {
        info.blocks.forEach((block2, i) => {
          if (i !== index && block2) {
            group_outros();
            transition_out(block2, 1, 1, () => {
              if (info.blocks[i] === block2) {
                info.blocks[i] = null;
              }
            });
            check_outros();
          }
        });
      } else {
        info.block.d(1);
      }
      block.c();
      transition_in(block, 1);
      block.m(info.mount(), info.anchor);
      needs_flush = true;
    }
    info.block = block;
    if (info.blocks)
      info.blocks[index] = block;
    if (needs_flush) {
      flush();
    }
  }
  if (is_promise(promise2)) {
    const current_component2 = get_current_component();
    promise2.then((value) => {
      set_current_component(current_component2);
      update2(info.then, 1, info.value, value);
      set_current_component(null);
    }, (error) => {
      set_current_component(current_component2);
      update2(info.catch, 2, info.error, error);
      set_current_component(null);
      if (!info.hasCatch) {
        throw error;
      }
    });
    if (info.current !== info.pending) {
      update2(info.pending, 0);
      return true;
    }
  } else {
    if (info.current !== info.then) {
      update2(info.then, 1, info.value, promise2);
      return true;
    }
    info.resolved = promise2;
  }
}
function update_await_block_branch(info, ctx, dirty) {
  const child_ctx = ctx.slice();
  const { resolved } = info;
  if (info.current === info.then) {
    child_ctx[info.value] = resolved;
  }
  if (info.current === info.catch) {
    child_ctx[info.error] = resolved;
  }
  info.block.p(child_ctx, dirty);
}
function destroy_block(block, lookup2) {
  block.d(1);
  lookup2.delete(block.key);
}
function outro_and_destroy_block(block, lookup2) {
  transition_out(block, 1, 1, () => {
    lookup2.delete(block.key);
  });
}
function fix_and_outro_and_destroy_block(block, lookup2) {
  block.f();
  outro_and_destroy_block(block, lookup2);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup2, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  const updates = [];
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup2.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else {
      updates.push(() => block.p(child_ctx, dirty));
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup2.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup2);
      o--;
    } else if (!lookup2.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup2);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  run_all(updates);
  return new_blocks;
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init$1(component, options2, instance2, create_fragment2, not_equal, props, append_styles2, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options2.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options2.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options2.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options2.target) {
    if (options2.hydrate) {
      const nodes = children(options2.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options2.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options2.target, options2.anchor, options2.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
const reset$ = new Subject();
const disconnectWallet$ = new Subject();
const connectWallet$ = new BehaviorSubject({ inProgress: false, actionRequired: "" });
const switchChainModal$ = new BehaviorSubject(null);
const wallets$ = state.select("wallets").pipe(shareReplay(1));
reset$.pipe(withLatestFrom(wallets$), pluck("1")).subscribe((wallets2) => {
  wallets2.forEach(({ label }) => {
    disconnectWallet$.next(label);
  });
  resetStore();
});
const transactions$ = new BehaviorSubject([]);
function removeTransaction(hash2) {
  const currentTransactions = transactions$.getValue();
  transactions$.next(currentTransactions.filter((tx) => tx.hash !== hash2));
}
defer(() => {
  const subject = new Subject();
  onMount(() => {
    subject.next();
  });
  return subject.asObservable().pipe(take(1));
});
const onDestroy$ = defer(() => {
  const subject = new Subject();
  onDestroy(() => {
    subject.next();
  });
  return subject.asObservable().pipe(take(1));
});
defer(() => {
  const subject = new Subject();
  afterUpdate(() => {
    subject.next();
  });
  return subject.asObservable().pipe(takeUntil(onDestroy$));
});
defer(() => {
  const subject = new Subject();
  beforeUpdate(() => {
    subject.next();
  });
  return subject.asObservable().pipe(takeUntil(onDestroy$));
});
const themes = {
  default: {
    "--w3o-background-color": "unset",
    "--w3o-foreground-color": "unset",
    "--w3o-text-color": "unset",
    "--w3o-border-color": "unset",
    "--w3o-action-color": "unset",
    "--w3o-border-radius": "unset",
    "--w3o-font-family": "inherit"
  },
  light: {
    "--w3o-background-color": "#ffffff",
    "--w3o-foreground-color": "#EFF1FC",
    "--w3o-text-color": "#1a1d26",
    "--w3o-border-color": "#d0d4f7",
    "--w3o-action-color": "#6370E5",
    "--w3o-border-radius": "16px",
    "--w3o-font-family": "inherit"
  },
  dark: {
    "--w3o-background-color": "#1A1D26",
    "--w3o-foreground-color": "#242835",
    "--w3o-text-color": "#EFF1FC",
    "--w3o-border-color": "#33394B",
    "--w3o-action-color": "#929bed",
    "--w3o-border-radius": "16px",
    "--w3o-font-family": "inherit"
  }
};
const returnTheme = (theme2) => {
  if (typeof theme2 === "string" && theme2 === "system") {
    return watchForSystemThemeChange();
  }
  return returnThemeMap(theme2);
};
const returnThemeMap = (theme2) => {
  if (typeof theme2 === "string" && theme2 in themes) {
    return themes[theme2];
  }
  if (typeof theme2 === "object") {
    return theme2;
  }
};
const handleThemeChange = (update2) => {
  Object.keys(update2).forEach((targetStyle) => {
    document.documentElement.style.setProperty(targetStyle, update2[targetStyle] || null);
  });
};
const watchForSystemThemeChange = () => {
  const systemThemeDark = window.matchMedia("(prefers-color-scheme: dark)");
  systemThemeDark.matches ? handleThemeChange(themes["dark"]) : handleThemeChange(themes["light"]);
  fromEvent(systemThemeDark, "change").pipe(takeUntil$1(reset$)).subscribe((changes) => {
    const themeChange = changes;
    themeChange.matches ? handleThemeChange(themes["dark"]) : handleThemeChange(themes["light"]);
  });
};
const unknownObject = Joi.object().unknown();
const connectedChain = Joi.object({
  namespace: chainNamespaceValidation.required(),
  id: chainIdValidation.required()
});
const ens = Joi.any().allow(Joi.object({
  name: Joi.string().required(),
  avatar: Joi.string(),
  contentHash: Joi.any().allow(Joi.string(), null),
  getText: Joi.function().arity(1).required()
}), null);
const uns = Joi.any().allow(Joi.object({
  name: Joi.string().required()
}), null);
const balance = Joi.any().allow(Joi.object({
  eth: Joi.number()
}).unknown(), null);
const secondaryTokens = Joi.any().allow(Joi.object({
  balance: Joi.string().required(),
  icon: Joi.string()
}), null);
const account = Joi.object({
  address: Joi.string().required(),
  ens,
  uns,
  balance,
  secondaryTokens
});
const chains = Joi.array().items(chainValidation).unique((a, b) => a.id === b.id).error((e) => {
  if (e[0].code === "array.unique") {
    return new Error(`There is a duplicate Chain ID in your Onboard Chains array: ${e}`);
  }
  return new Error(`${e}`);
});
const accounts = Joi.array().items(account);
const wallet = Joi.object({
  label: Joi.string(),
  icon: Joi.string(),
  provider: unknownObject,
  instance: unknownObject,
  accounts,
  chains: Joi.array().items(connectedChain),
  wagmiConnector: unknownObject
}).required().error(new Error("wallet must be defined"));
const wallets = Joi.array().items(wallet);
const recommendedWallet = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().uri().required()
});
const agreement = Joi.object({
  version: Joi.string().required(),
  termsUrl: Joi.string().uri(),
  privacyUrl: Joi.string().uri()
});
const appMetadata = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  icon: Joi.string(),
  logo: Joi.string(),
  gettingStartedGuide: Joi.string(),
  email: Joi.string(),
  appUrl: Joi.string(),
  explore: Joi.string(),
  recommendedInjectedWallets: Joi.array().items(recommendedWallet),
  agreement
});
const appMetadataUpdate = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  icon: Joi.string(),
  logo: Joi.string(),
  gettingStartedGuide: Joi.string(),
  email: Joi.string(),
  appUrl: Joi.string(),
  explore: Joi.string(),
  recommendedInjectedWallets: Joi.array().items(recommendedWallet),
  agreement
});
Joi.object({
  label: Joi.string().required(),
  getInfo: Joi.function().arity(1).required(),
  getInterface: Joi.function().arity(1).required()
});
const walletInit = Joi.array().items(Joi.function()).required();
const locale = Joi.string();
const commonPositions = Joi.string().valid("topRight", "bottomRight", "bottomLeft", "topLeft");
const gasPriceProbabilities = [70, 80, 90, 95, 99];
const notify$1 = Joi.object({
  transactionHandler: Joi.function().optional(),
  enabled: Joi.boolean(),
  position: commonPositions,
  replacement: Joi.object({
    gasPriceProbability: Joi.object({
      speedup: Joi.number().valid(...gasPriceProbabilities),
      cancel: Joi.number().valid(...gasPriceProbabilities)
    })
  })
});
const notifyOptions = Joi.object({
  desktop: notify$1,
  mobile: notify$1
});
const accountCenterInitOptions = Joi.object({
  enabled: Joi.boolean(),
  position: commonPositions,
  minimal: Joi.boolean(),
  containerElement: Joi.string(),
  hideTransactionProtectionBtn: Joi.boolean(),
  transactionProtectionInfoLink: Joi.string()
});
const accountCenter$1 = Joi.object({
  enabled: Joi.boolean(),
  position: commonPositions,
  expanded: Joi.boolean(),
  minimal: Joi.boolean(),
  hideTransactionProtectionBtn: Joi.boolean(),
  transactionProtectionInfoLink: Joi.string(),
  containerElement: Joi.string()
});
const connectModalOptions = Joi.object({
  showSidebar: Joi.boolean(),
  disableClose: Joi.boolean(),
  autoConnectLastWallet: Joi.boolean(),
  autoConnectAllPreviousWallet: Joi.boolean(),
  iDontHaveAWalletLink: Joi.string(),
  wheresMyWalletLink: Joi.string(),
  removeWhereIsMyWalletWarning: Joi.boolean(),
  removeIDontHaveAWalletInfoLink: Joi.boolean(),
  disableUDResolution: Joi.boolean()
});
const containerElements = Joi.object({
  accountCenter: Joi.string(),
  connectModal: Joi.string()
});
const themeMap = Joi.object({
  "--w3o-background-color": Joi.string(),
  "--w3o-font-family": Joi.string(),
  "--w3o-foreground-color": Joi.string(),
  "--w3o-text-color": Joi.string(),
  "--w3o-border-color": Joi.string(),
  "--w3o-action-color": Joi.string(),
  "--w3o-border-radius": Joi.string()
});
const presetTheme = Joi.string().valid("default", "dark", "light", "system");
const theme = Joi.alternatives().try(themeMap, presetTheme);
const initOptions = Joi.object({
  wallets: walletInit,
  chains: chains.required(),
  appMetadata,
  i18n: Joi.object().unknown(),
  apiKey: Joi.string(),
  accountCenter: Joi.object({
    desktop: accountCenterInitOptions,
    mobile: accountCenterInitOptions,
    hideTransactionProtectionBtn: Joi.boolean(),
    transactionProtectionInfoLink: Joi.string()
  }),
  notify: [notifyOptions, notify$1],
  gas: Joi.object({
    get: Joi.function().required(),
    stream: Joi.function().required()
  }),
  wagmi: Joi.function(),
  connect: connectModalOptions,
  containerElements,
  // transactionPreview is deprecated but is still allowed to 
  // avoid breaking dapps a console error is shown although 
  // transactionPreview functionality has been removed
  transactionPreview: Joi.any(),
  theme,
  disableFontDownload: Joi.boolean(),
  unstoppableResolution: Joi.function()
});
const connectOptions = Joi.object({
  autoSelect: Joi.alternatives().try(Joi.object({
    label: Joi.string().required(),
    disableModals: Joi.boolean()
  }), Joi.string())
});
const disconnectOptions = Joi.object({
  label: Joi.string().required()
}).required();
const secondaryTokenValidation = Joi.object({
  address: Joi.string().required(),
  icon: Joi.string().optional()
});
const setChainOptions = Joi.object({
  chainId: chainIdValidation.required(),
  chainNamespace: chainNamespaceValidation,
  wallet: Joi.string(),
  rpcUrl: Joi.string(),
  label: Joi.string(),
  token: Joi.string(),
  protectedRpcUrl: Joi.string(),
  secondaryTokens: Joi.array().max(5).items(secondaryTokenValidation).optional()
});
const customNotificationUpdate = Joi.object({
  key: Joi.string().required(),
  type: Joi.string().allow("pending", "error", "success", "hint"),
  eventCode: Joi.string(),
  message: Joi.string().required(),
  id: Joi.string().required(),
  autoDismiss: Joi.number(),
  onClick: Joi.function(),
  link: Joi.string()
});
Joi.object({
  sendTransaction: Joi.function(),
  estimateGas: Joi.function(),
  gasPrice: Joi.function(),
  balance: Joi.alternatives(Joi.string(), Joi.number()),
  txDetails: Joi.object({
    value: Joi.alternatives(Joi.string(), Joi.number()),
    to: Joi.string(),
    from: Joi.string()
  }),
  txApproveReminderTimeout: Joi.number()
});
const customNotification$1 = Joi.object({
  key: Joi.string(),
  type: Joi.string().allow("pending", "error", "success", "hint"),
  eventCode: Joi.string(),
  message: Joi.string(),
  id: Joi.string(),
  autoDismiss: Joi.number(),
  onClick: Joi.function(),
  link: Joi.string()
});
Joi.object({
  id: Joi.string().required(),
  key: Joi.string().required(),
  type: Joi.string().allow("pending", "error", "success", "hint").required(),
  eventCode: Joi.string().required(),
  message: Joi.string().required(),
  autoDismiss: Joi.number().required(),
  network: Joi.string().required(),
  startTime: Joi.number(),
  onClick: Joi.function(),
  link: Joi.string()
});
function validateWallet(data) {
  return validate(wallet, data);
}
function validateInitOptions(data) {
  return validate(initOptions, data);
}
function validateConnectOptions(data) {
  return validate(connectOptions, data);
}
function validateDisconnectOptions(data) {
  return validate(disconnectOptions, data);
}
function validateString(str, label) {
  return validate(Joi.string().required().label(label || "value"), str);
}
function validateSetChainOptions(data) {
  return validate(setChainOptions, data);
}
function validateAccountCenterUpdate(data) {
  return validate(accountCenter$1, data);
}
function validateConnectModalUpdate(data) {
  return validate(connectModalOptions, data);
}
function validateWalletInit(data) {
  return validate(walletInit, data);
}
function validateLocale(data) {
  return validate(locale, data);
}
function validateNotify(data) {
  return validate(notify$1, data);
}
function validateNotifyOptions(data) {
  return validate(notifyOptions, data);
}
function validateCustomNotificationUpdate(data) {
  return validate(customNotificationUpdate, data);
}
function validateCustomNotification(data) {
  return validate(customNotification$1, data);
}
function validateUpdateBalances(data) {
  return validate(wallets, data);
}
function validateUpdateTheme(data) {
  return validate(theme, data);
}
function validateAppMetadataUpdate(data) {
  return validate(appMetadataUpdate, data);
}
function addChains(chains2) {
  const action = {
    type: ADD_CHAINS,
    payload: chains2.map((_a) => {
      var { namespace = "evm", id, rpcUrl } = _a, rest = __rest(_a, ["namespace", "id", "rpcUrl"]);
      return Object.assign(Object.assign({}, rest), { namespace, id: id.toLowerCase(), rpcUrl: rpcUrl ? rpcUrl.trim() : null });
    })
  };
  dispatch$1(action);
}
function updateChain(updatedChain) {
  const { label, token, rpcUrl, id: chainId, namespace: chainNamespace } = updatedChain;
  const error = validateSetChainOptions({
    label,
    token,
    rpcUrl,
    chainId,
    chainNamespace
  });
  if (error) {
    throw error;
  }
  const action = {
    type: UPDATE_CHAINS,
    payload: updatedChain
  };
  dispatch$1(action);
}
function addWallet(wallet2) {
  const error = validateWallet(wallet2);
  if (error) {
    console.error(error);
    throw error;
  }
  const action = {
    type: ADD_WALLET,
    payload: wallet2
  };
  dispatch$1(action);
}
function updateWallet(id, update2) {
  const error = validateWallet(update2);
  if (error) {
    console.error(error);
    throw error;
  }
  const action = {
    type: UPDATE_WALLET,
    payload: Object.assign({ id }, update2)
  };
  dispatch$1(action);
}
function removeWallet(id) {
  const error = validateString(id, "wallet id");
  if (error) {
    throw error;
  }
  const action = {
    type: REMOVE_WALLET,
    payload: {
      id
    }
  };
  dispatch$1(action);
}
function setPrimaryWallet(wallet2, address) {
  const error = validateWallet(wallet2) || address && validateString(address, "address");
  if (error) {
    throw error;
  }
  if (address) {
    const account2 = wallet2.accounts.find((ac) => ac.address === address);
    if (account2) {
      wallet2.accounts = [
        account2,
        ...wallet2.accounts.filter(({ address: address2 }) => address2 !== account2.address)
      ];
    }
  }
  handleWagmiConnectorUpdate(wallet2);
  addWallet(wallet2);
}
function updateAccount(id, address, update2) {
  const action = {
    type: UPDATE_ACCOUNT,
    payload: Object.assign({
      id,
      address
    }, update2)
  };
  dispatch$1(action);
}
function updateAccountCenter(update2) {
  const error = validateAccountCenterUpdate(update2);
  if (error) {
    throw error;
  }
  const action = {
    type: UPDATE_ACCOUNT_CENTER,
    payload: update2
  };
  dispatch$1(action);
}
function updateConnectModal(update2) {
  const error = validateConnectModalUpdate(update2);
  if (error) {
    throw error;
  }
  const action = {
    type: UPDATE_CONNECT_MODAL,
    payload: update2
  };
  dispatch$1(action);
}
function updateNotify(update2) {
  const error = validateNotify(update2);
  if (error) {
    throw error;
  }
  const action = {
    type: UPDATE_NOTIFY,
    payload: update2
  };
  dispatch$1(action);
}
function addCustomNotification(notification) {
  const customNotificationError = validateCustomNotificationUpdate(notification);
  if (customNotificationError) {
    throw customNotificationError;
  }
  const action = {
    type: ADD_NOTIFICATION,
    payload: notification
  };
  dispatch$1(action);
}
function customNotification(updatedNotification) {
  const customNotificationError = validateCustomNotification(updatedNotification);
  if (customNotificationError) {
    throw customNotificationError;
  }
  const customIdKey = `customNotification-${nanoid()}`;
  const notification = Object.assign(Object.assign({}, updatedNotification), { id: customIdKey, key: customIdKey });
  addCustomNotification(notification);
  const dismiss = () => {
    if (notification.id) {
      removeNotification(notification.id);
    }
  };
  const update2 = (notificationUpdate) => {
    const customNotificationError2 = validateCustomNotification(updatedNotification);
    if (customNotificationError2) {
      throw customNotificationError2;
    }
    const notificationAfterUpdate = Object.assign(Object.assign({}, notificationUpdate), { id: notification.id, key: notification.key });
    addCustomNotification(notificationAfterUpdate);
    return {
      dismiss,
      update: update2
    };
  };
  addCustomNotification(notification);
  return {
    dismiss,
    update: update2
  };
}
function removeNotification(id) {
  if (typeof id !== "string") {
    throw new Error("Notification id must be of type string");
  }
  const action = {
    type: REMOVE_NOTIFICATION,
    payload: id
  };
  dispatch$1(action);
}
function resetStore() {
  const action = {
    type: RESET_STORE
  };
  dispatch$1(action);
}
function setWalletModules(wallets2) {
  const error = validateWalletInit(wallets2);
  if (error) {
    throw error;
  }
  const modules = initializeWalletModules(wallets2);
  const dedupedWallets = uniqueWalletsByLabel(modules);
  const action = {
    type: SET_WALLET_MODULES,
    payload: dedupedWallets
  };
  dispatch$1(action);
}
function setLocale(locale2) {
  const error = validateLocale(locale2);
  if (error) {
    throw error;
  }
  const action = {
    type: SET_LOCALE,
    payload: locale2
  };
  dispatch$1(action);
}
function updateAllWallets(wallets2) {
  const error = validateUpdateBalances(wallets2);
  if (error) {
    throw error;
  }
  const action = {
    type: UPDATE_ALL_WALLETS,
    payload: wallets2
  };
  dispatch$1(action);
}
function initializeWalletModules(modules) {
  const { device } = configuration;
  if (!device)
    return [];
  return modules.reduce((acc, walletInit2) => {
    const initialized = walletInit2({ device });
    if (initialized) {
      acc.push(...Array.isArray(initialized) ? initialized : [initialized]);
    }
    return acc;
  }, []);
}
function uniqueWalletsByLabel(walletModuleList) {
  return walletModuleList.filter((wallet2, i) => wallet2 && walletModuleList.findIndex((innerWallet) => innerWallet && innerWallet.label === wallet2.label) === i);
}
function updateTheme(theme2) {
  const error = validateUpdateTheme(theme2);
  if (error) {
    throw error;
  }
  const themingObj = returnTheme(theme2);
  themingObj && handleThemeChange(themingObj);
}
function updateAppMetadata(update2) {
  const error = validateAppMetadataUpdate(update2);
  if (error) {
    throw error;
  }
  const action = {
    type: UPDATE_APP_METADATA,
    payload: update2
  };
  dispatch$1(action);
}
function updateWagmiConfig(update2) {
  const action = {
    type: UPDATE_WAGMI_CONFIG,
    payload: update2
  };
  dispatch$1(action);
}
function handleWagmiConnectorUpdate(wallet2) {
  const { wagmi } = configuration;
  if (!wagmi)
    return;
  try {
    const { label } = wallet2;
    const { wagmiConnect, getWagmiConnector } = wagmi;
    const wagmiConfig = state.get().wagmiConfig;
    const wagmiConnector = getWagmiConnector(label);
    wagmiConnect(wagmiConfig, { connector: wagmiConnector }).then(() => {
      updateWallet(label, { wagmiConnector });
    });
  } catch (e) {
    console.error(`Error updating Wagmi connector on primary wallet switch ${e}`);
  }
}
async function connect$1(options2) {
  if (options2) {
    const error = validateConnectOptions(options2);
    if (error) {
      throw error;
    }
  }
  const { chains: chains2 } = state.get();
  if (!chains2.length)
    throw new Error("At least one chain must be set before attempting to connect a wallet");
  let { autoSelect } = options2 || {};
  if (!autoSelect) {
    autoSelect = { label: "", disableModals: false };
  }
  if (autoSelect && (typeof autoSelect === "string" || autoSelect.label)) {
    await wait$1(50);
  }
  if (!state.get().walletModules.length) {
    setWalletModules(configuration.initialWalletInit);
  }
  connectWallet$.next({
    autoSelect: typeof autoSelect === "string" ? { label: autoSelect, disableModals: false } : autoSelect,
    inProgress: true
  });
  const result$ = connectWallet$.pipe(filter(({ inProgress, actionRequired }) => inProgress === false && !actionRequired), withLatestFrom(wallets$), pluck(1));
  return firstValueFrom(result$);
}
async function disconnect(options2) {
  const error = validateDisconnectOptions(options2);
  if (error) {
    throw error;
  }
  const { label } = options2;
  const { wagmi } = configuration;
  if (wagmi) {
    const wagmiConfig = await wagmi.wagmiDisconnectWallet(label);
    if (wagmiConfig) {
      updateWagmiConfig(wagmiConfig);
    }
  }
  disconnectWallet$.next(label);
  removeWallet(label);
  const lastConnectedWallets = getLocalStore(STORAGE_KEYS.LAST_CONNECTED_WALLET);
  if (lastConnectedWallets) {
    try {
      const labels = JSON.parse(lastConnectedWallets);
      if (Array.isArray(labels) && labels.indexOf(label) >= 0) {
        setLocalStore(STORAGE_KEYS.LAST_CONNECTED_WALLET, JSON.stringify(labels.filter((walletLabel) => walletLabel !== label)));
      }
      if (typeof labels === "string" && labels === label) {
        delLocalStore(STORAGE_KEYS.LAST_CONNECTED_WALLET);
      }
    } catch (e) {
      console.error(`There was an error disconnecting the last connected wallet from localStorage - Error: ${e}`);
    }
  }
  return state.get().wallets;
}
async function updateBalances(addresses) {
  const { wallets: wallets2, chains: chains2 } = state.get();
  const updatedWallets = await Promise.all(wallets2.map(async (wallet2) => {
    const chain = chains2.find(({ id }) => id === wallet2.chains[0].id);
    if (!chain)
      return;
    const updatedAccounts = await Promise.all(wallet2.accounts.map(async (account2) => {
      const secondaryTokens2 = await updateSecondaryTokens(account2.address, chain);
      if (!addresses || addresses.some((address) => address.toLowerCase() === account2.address.toLowerCase())) {
        const updatedBalance = await getBalance(account2.address, chain);
        return Object.assign(Object.assign({}, account2), { balance: updatedBalance, secondaryTokens: secondaryTokens2 });
      }
      return Object.assign(Object.assign({}, account2), { secondaryTokens: secondaryTokens2 });
    }));
    return Object.assign(Object.assign({}, wallet2), { accounts: updatedAccounts });
  }));
  updateAllWallets(updatedWallets);
}
const updateSecondaryTokens = async (accountAddress, chain) => {
  if (!chain)
    return [];
  const chainRPC = chain.rpcUrl;
  if (!chain.secondaryTokens || !chain.secondaryTokens.length || !chainRPC)
    return [];
  const tokenBalances = await Promise.all(chain.secondaryTokens.map(async (token) => {
    try {
      const { createPublicClient, http } = await import("viem");
      const viemChain = await chainIdToViemImport(chain);
      const client = createPublicClient({
        chain: viemChain,
        transport: http(chain.providerConnectionInfo && chain.providerConnectionInfo.url ? chain.providerConnectionInfo.url : chainRPC)
      });
      const viemTokenInterface = {
        abi: [
          {
            inputs: [{ name: "owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
          },
          {
            inputs: [],
            name: "symbol",
            outputs: [{ name: "", type: "string" }],
            stateMutability: "view",
            type: "function"
          }
        ],
        address: token.address
      };
      const supplyProm = client.readContract(Object.assign(Object.assign({}, viemTokenInterface), { functionName: "balanceOf", args: [accountAddress] })) || "";
      const tokenProm = client.readContract(Object.assign(Object.assign({}, viemTokenInterface), { functionName: "symbol", args: [] })) || "";
      const [tokenSupply, tokenName] = await Promise.all([
        supplyProm,
        tokenProm
      ]);
      return {
        name: tokenName,
        balance: weiToEth(tokenSupply.toString()),
        icon: token.icon
      };
    } catch (error) {
      console.error(`There was an error fetching balance and/or symbol 
          for token contract: ${token.address} - ${error}`);
    }
  }));
  return tokenBalances;
};
const viemProviders = {};
async function getProvider(chain) {
  if (!chain)
    return null;
  if (!viemProviders[chain.rpcUrl]) {
    const viemChain = await chainIdToViemENSImport(chain.id);
    if (!viemChain)
      return null;
    const { createPublicClient, http } = await import("viem");
    const publicProvider = createPublicClient({
      chain: viemChain,
      transport: http()
    });
    viemProviders[chain.rpcUrl] = publicProvider;
  }
  return viemProviders[chain.rpcUrl];
}
function requestAccounts(provider) {
  const args = { method: "eth_requestAccounts" };
  return provider.request(args);
}
function selectAccounts(provider) {
  const args = { method: "eth_selectAccounts" };
  return provider.request(args);
}
function getChainId(provider) {
  return provider.request({ method: "eth_chainId" });
}
function listenAccountsChanged(args) {
  const { provider, disconnected$ } = args;
  const addHandler = (handler) => {
    provider.on("accountsChanged", handler);
  };
  const removeHandler = (handler) => {
    provider.removeListener("accountsChanged", handler);
  };
  return fromEventPattern(addHandler, removeHandler).pipe(takeUntil(disconnected$));
}
function listenChainChanged(args) {
  const { provider, disconnected$ } = args;
  const addHandler = (handler) => {
    provider.on("chainChanged", handler);
  };
  const removeHandler = (handler) => {
    provider.removeListener("chainChanged", handler);
  };
  return fromEventPattern(addHandler, removeHandler).pipe(takeUntil(disconnected$));
}
function trackWallet(provider, label) {
  const disconnected$ = disconnectWallet$.pipe(filter((wallet2) => wallet2 === label), take(1));
  const accountsChanged$ = listenAccountsChanged({
    provider,
    disconnected$
  }).pipe(share());
  accountsChanged$.subscribe(async ([address]) => {
    try {
      await syncWalletConnectedAccounts(label);
    } catch (error) {
      console.warn("Web3Onboard: Error whilst trying to sync connected accounts:", error);
    }
    if (!address) {
      disconnect({ label });
      return;
    }
    const { wallets: wallets2 } = state.get();
    const wallet2 = wallets2.find((wallet3) => wallet3.label === label);
    const accounts2 = wallet2 ? wallet2.accounts : [];
    const [[existingAccount], restAccounts] = partition(accounts2, (account2) => account2.address === address);
    updateWallet(label, {
      accounts: [
        existingAccount || {
          address,
          ens: null,
          uns: null,
          balance: null
        },
        ...restAccounts
      ]
    });
  });
  accountsChanged$.pipe(switchMap(async ([address]) => {
    if (!address)
      return;
    const { wallets: wallets2, chains: chains2 } = state.get();
    const primaryWallet = wallets2.find((wallet2) => wallet2.label === label);
    if (!primaryWallet)
      return;
    const { chains: walletChains, accounts: accounts2 } = primaryWallet;
    const [connectedWalletChain] = walletChains;
    const chain = chains2.find(({ namespace, id }) => namespace === "evm" && id === connectedWalletChain.id);
    if (!chain)
      return;
    const balanceProm = getBalance(address, chain);
    const secondaryTokenBal = updateSecondaryTokens(address, chain);
    const account2 = accounts2.find((account3) => account3.address === address);
    const ensChain = chains2.find(({ id }) => id === validEnsChain(connectedWalletChain.id));
    const ensProm = account2 && account2.ens ? Promise.resolve(account2.ens) : ensChain ? getEns(address, ensChain) : Promise.resolve(null);
    const unsProm = account2 && account2.uns ? Promise.resolve(account2.uns) : ensChain ? getUns(address, ensChain) : Promise.resolve(null);
    return Promise.all([
      Promise.resolve(address),
      balanceProm,
      ensProm,
      unsProm,
      secondaryTokenBal
    ]);
  })).subscribe((res) => {
    if (!res)
      return;
    const [address, balance2, ens2, uns2, secondaryTokens2] = res;
    updateAccount(label, address, { balance: balance2, ens: ens2, uns: uns2, secondaryTokens: secondaryTokens2 });
  });
  const chainChanged$ = listenChainChanged({ provider, disconnected$ }).pipe(share());
  chainChanged$.subscribe(async (chainId) => {
    const { wallets: wallets2 } = state.get();
    const wallet2 = wallets2.find((wallet3) => wallet3.label === label);
    if (!wallet2)
      return;
    const { chains: chains2, accounts: accounts2 } = wallet2;
    const [connectedWalletChain] = chains2;
    if (!isHex(chainId)) {
      chainId = toHex(chainId);
    }
    if (chainId === connectedWalletChain.id)
      return;
    const resetAccounts = accounts2.map(({ address }) => ({
      address,
      ens: null,
      uns: null,
      balance: null
    }));
    updateWallet(label, {
      chains: [{ namespace: "evm", id: chainId }],
      accounts: resetAccounts
    });
  });
  chainChanged$.pipe(switchMap(async (chainId) => {
    const { wallets: wallets2, chains: chains2 } = state.get();
    const primaryWallet = wallets2.find((wallet2) => wallet2.label === label);
    const accounts2 = (primaryWallet === null || primaryWallet === void 0 ? void 0 : primaryWallet.accounts) || [];
    if (!isHex(chainId)) {
      chainId = toHex(chainId);
    }
    const chain = chains2.find(({ namespace, id }) => namespace === "evm" && id === chainId);
    if (!chain)
      return Promise.resolve(null);
    return Promise.all(accounts2.map(async ({ address }) => {
      const balanceProm = getBalance(address, chain);
      const secondaryTokenBal = updateSecondaryTokens(address, chain);
      const ensChain = chains2.find(({ id }) => id === validEnsChain(chainId));
      const ensProm = ensChain ? getEns(address, ensChain) : Promise.resolve(null);
      const unsProm = ensChain ? getUns(address, ensChain) : Promise.resolve(null);
      const [balance2, ens2, uns2, secondaryTokens2] = await Promise.all([
        balanceProm,
        ensProm,
        unsProm,
        secondaryTokenBal
      ]);
      return {
        address,
        balance: balance2,
        ens: ens2,
        uns: uns2,
        secondaryTokens: secondaryTokens2
      };
    }));
  })).subscribe((updatedAccounts) => {
    updatedAccounts && updateWallet(label, { accounts: updatedAccounts });
  });
  disconnected$.subscribe(() => {
    provider.disconnect && provider.disconnect();
  });
}
async function getEns(address, chain) {
  if (!chain)
    return null;
  const provider = await getProvider(chain);
  if (!provider)
    return null;
  try {
    const name = await provider.getEnsName({
      address
    });
    let ens2 = null;
    if (name) {
      const { labelhash, normalize } = await import("./index-021f6a62.js").then(function(n) {
        return n.i;
      });
      const normalizedName = normalize(name);
      const ensResolver = await provider.getEnsResolver({
        name: normalizedName
      });
      const avatar = await provider.getEnsAvatar({
        name: normalizedName
      });
      const contentHash = labelhash(normalizedName);
      const getText = async (key) => {
        return await provider.getEnsText({
          name,
          key
        });
      };
      ens2 = {
        name,
        avatar,
        contentHash,
        ensResolver,
        getText
      };
    }
    return ens2;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getUns(address, chain) {
  const { unstoppableResolution } = configuration;
  if (!unstoppableResolution || !isAddress(address) || !chain)
    return null;
  try {
    return await unstoppableResolution(address);
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getBalance(address, chain) {
  if (!chain)
    return null;
  const { wallets: wallets2 } = state.get();
  try {
    const wallet2 = wallets2.find((wallet3) => !!wallet3.provider);
    if (!wallet2)
      return null;
    const provider = wallet2.provider;
    const balanceHex = await provider.request({
      method: "eth_getBalance",
      params: [address, "latest"]
    });
    return balanceHex ? { [chain.token || "eth"]: weiHexToEth(balanceHex) } : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
function switchChain(provider, chainId) {
  return provider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId }]
  });
}
function addNewChain(provider, chain) {
  return provider.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: chain.id,
        chainName: chain.label,
        nativeCurrency: {
          name: chain.label,
          symbol: chain.token,
          decimals: 18
        },
        rpcUrls: [chain.publicRpcUrl || chain.rpcUrl],
        blockExplorerUrls: chain.blockExplorerUrl ? [chain.blockExplorerUrl] : null
      }
    ]
  });
}
function updateChainRPC(provider, chain, rpcUrl) {
  return provider.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: chain.id,
        chainName: chain.label,
        nativeCurrency: {
          name: chain.label,
          symbol: chain.token,
          decimals: 18
        },
        rpcUrls: [rpcUrl],
        blockExplorerUrls: chain.blockExplorerUrl ? [chain.blockExplorerUrl] : void 0
      }
    ]
  });
}
async function getPermissions(provider) {
  try {
    const permissions = await provider.request({
      method: "wallet_getPermissions"
    });
    return Array.isArray(permissions) ? permissions : [];
  } catch (error) {
    return [];
  }
}
async function syncWalletConnectedAccounts(label) {
  const wallet2 = state.get().wallets.find((wallet3) => wallet3.label === label);
  if (!wallet2)
    return;
  const permissions = await getPermissions(wallet2.provider);
  const accountsPermissions = permissions.find(({ parentCapability }) => parentCapability === "eth_accounts");
  if (accountsPermissions) {
    const { value: connectedAccounts } = accountsPermissions.caveats.find(({ type }) => type === "restrictReturnedAccounts") || { value: null };
    if (connectedAccounts) {
      const syncedAccounts = wallet2.accounts.filter(({ address }) => connectedAccounts.includes(address));
      updateWallet(wallet2.label, Object.assign(Object.assign({}, wallet2), { accounts: syncedAccounts }));
    }
  }
}
const addOrSwitchChain = async (provider, chain) => {
  try {
    const { id } = chain;
    await addNewChain(provider, chain);
    await switchChain(provider, id);
    return id;
  } catch (error) {
    return void 0;
  }
};
const wagmiProviderMethods = () => ({
  addOrSwitchChain,
  getChainId,
  requestAccounts,
  switchChain
});
async function setChain(options2) {
  const error = validateSetChainOptions(options2);
  if (error) {
    throw error;
  }
  const { wallets: wallets2, chains: chains2 } = state.get();
  const { chainId, chainNamespace = "evm", wallet: walletToSet, rpcUrl, label, token } = options2;
  const chainIdHex = toHexString(chainId);
  const chain = chains2.find(({ namespace, id }) => namespace === chainNamespace && id.toLowerCase() === chainIdHex.toLowerCase());
  if (!chain) {
    throw new Error(`Chain with chainId: ${chainId} and chainNamespace: ${chainNamespace} has not been set and must be added when Onboard is initialized.`);
  }
  const wallet2 = walletToSet ? wallets2.find(({ label: label2 }) => label2 === walletToSet) : wallets2[0];
  if (!wallet2) {
    throw new Error(walletToSet ? `Wallet with label ${walletToSet} is not connected` : "A wallet must be connected before a chain can be set");
  }
  const [walletConnectedChain] = wallet2.chains;
  if (walletConnectedChain.namespace === chainNamespace && walletConnectedChain.id === chainIdHex) {
    return true;
  }
  try {
    await switchChain(wallet2.provider, chainIdHex);
    return true;
  } catch (error2) {
    const { code } = error2;
    const switchChainModalClosed$ = switchChainModal$.pipe(filter((x) => x === null), map(() => false));
    if (code === ProviderRpcErrorCode.CHAIN_NOT_ADDED || code === ProviderRpcErrorCode.UNRECOGNIZED_CHAIN_ID) {
      if (rpcUrl || label || token) {
        if (rpcUrl) {
          chain.rpcUrl = rpcUrl;
        }
        if (label) {
          chain.label = label;
        }
        if (token) {
          chain.token = token;
        }
        updateChain(chain);
      }
      return chainNotInWallet(wallet2, chain, switchChainModalClosed$, chainIdHex);
    }
    if (code === ProviderRpcErrorCode.UNSUPPORTED_METHOD) {
      switchChainModal$.next({ chain });
      return firstValueFrom(switchChainModalClosed$);
    }
  }
  return false;
}
const chainNotInWallet = async (wallet2, chain, switchChainModalClosed$, chainIdHex) => {
  try {
    await addNewChain(wallet2.provider, chain);
    await switchChain(wallet2.provider, chainIdHex);
    return true;
  } catch (error) {
    const { code } = error;
    if (code === ProviderRpcErrorCode.ACCOUNT_ACCESS_REJECTED) {
      return false;
    }
    switchChainModal$.next({ chain });
    return firstValueFrom(switchChainModalClosed$);
  }
};
var connect = {
  selectingWallet: {
    header: "Available Wallets",
    sidebar: {
      heading: "",
      subheading: "Connect your wallet",
      paragraph: "Connecting your wallet is like “logging in” to Web3. Select your wallet from the options to get started.",
      IDontHaveAWallet: "I don't have a wallet"
    },
    recommendedWalletsPart1: "{app} only supports",
    recommendedWalletsPart2: "on this platform. Please use or install one of the supported wallets to continue",
    installWallet: "You do not have any wallets installed that {app} supports, please use a supported wallet",
    agreement: {
      agree: "I agree to the",
      terms: "Terms & Conditions",
      and: "and",
      privacy: "Privacy Policy"
    },
    whyDontISeeMyWallet: "Why don't I see my wallet?",
    learnMore: "Click here to learn more"
  },
  connectingWallet: {
    header: "{connectionRejected, select, false {Connecting to {wallet}...} other {Connection Rejected}}",
    sidebar: {
      subheading: "Approve Connection",
      paragraph: "Please approve the connection in your wallet and authorize access to continue."
    },
    mainText: "Connecting...",
    paragraph: "Make sure to select all accounts that you want to grant access to.",
    previousConnection: "{wallet} already has a pending connection request, please open the {wallet} app to login and connect.",
    rejectedText: "Connection Rejected!",
    rejectedCTA: "Click here to try again",
    primaryButton: "Back to wallets"
  },
  connectedWallet: {
    header: "Connection Successful",
    sidebar: {
      subheading: "Connection Successful!",
      paragraph: "Your wallet is now connected to {app}"
    },
    mainText: "Connected",
    accountSelected: "Account Selected",
    availableWallet: "available wallet"
  }
};
var modals = {
  actionRequired: {
    heading: "Action required in {wallet}",
    paragraph: "Please switch the active account in your wallet.",
    linkText: "Learn more.",
    buttonText: "Okay"
  },
  switchChain: {
    heading: "Switch Chain",
    paragraph1: "{app} requires that you switch your wallet to the {nextNetworkName} network to continue.",
    paragraph2: "*Some wallets may not support changing networks. If you can not change networks in your wallet you may consider switching to a different wallet."
  },
  confirmDisconnectAll: {
    heading: "Disconnect all Wallets",
    description: "Are you sure that you would like to disconnect all your wallets?",
    confirm: "Confirm",
    cancel: "Cancel"
  },
  confirmTransactionProtection: {
    heading: "Enable Transaction Protection",
    description: "Protect RPC endpoints hide your transaction from front-running and sandwich bots.",
    link: "Learn more",
    enable: "Enable",
    dismiss: "Dismiss"
  }
};
var accountCenter = {
  connectAnotherWallet: "Connect another Wallet",
  disconnectAllWallets: "Disconnect all Wallets",
  currentNetwork: "Current Network",
  enableTransactionProtection: "Enable Transaction Protection",
  appInfo: "App Info",
  learnMore: "Learn More",
  gettingStartedGuide: "Getting Started Guide",
  smartContracts: "Smart Contract(s)",
  explore: "Explore",
  poweredBy: "powered by",
  addAccount: "Add Account",
  setPrimaryAccount: "Set Primary Account",
  disconnectWallet: "Disconnect Wallet",
  copyAddress: "Copy Wallet address"
};
var notify = {
  transaction: {
    txRequest: "Your transaction is waiting for you to confirm",
    nsfFail: "You have insufficient funds for this transaction",
    txUnderpriced: "The gas price for your transaction is too low, try a higher gas price",
    txRepeat: "This could be a repeat transaction",
    txAwaitingApproval: "You have a previous transaction waiting for you to confirm",
    txConfirmReminder: "Please confirm your transaction to continue",
    txSendFail: "You rejected the transaction",
    txSent: "Your transaction has been sent to the network",
    txStallPending: "Your transaction has stalled before it was sent, please try again",
    txStuck: "Your transaction is stuck due to a nonce gap",
    txPool: "Your transaction has started",
    txStallConfirmed: "Your transaction has stalled and hasn't been confirmed",
    txSpeedUp: "Your transaction has been sped up",
    txCancel: "Your transaction is being canceled",
    txFailed: "Your transaction has failed",
    txConfirmed: "Your transaction has succeeded",
    txError: "Oops something went wrong, please try again",
    txReplaceError: "There was an error replacing your transaction, please try again"
  },
  watched: {
    txPool: "Your account is {verb} {formattedValue} {asset} {preposition} {counterpartyShortened}",
    txSpeedUp: "Transaction for {formattedValue} {asset} {preposition} {counterpartyShortened} has been sped up",
    txCancel: "Transaction for {formattedValue} {asset} {preposition} {counterpartyShortened} has been canceled",
    txConfirmed: "Your account successfully {verb} {formattedValue} {asset} {preposition} {counterpartyShortened}",
    txFailed: "Your account failed to {verb} {formattedValue} {asset} {preposition} {counterpartyShortened}",
    txStuck: "Your transaction is stuck due to a nonce gap"
  },
  time: {
    minutes: "min",
    seconds: "sec"
  }
};
var en = {
  connect,
  modals,
  accountCenter,
  notify
};
function initialize(options2) {
  if (options2) {
    const { en: customizedEn } = options2;
    const merged = merge(en, customizedEn || {});
    addMessages("en", merged);
    const customLocales = Object.keys(options2).filter((key) => key !== "en");
    customLocales.forEach((locale2) => {
      const dictionary2 = options2[locale2];
      dictionary2 && addMessages(locale2, dictionary2);
    });
  } else {
    addMessages("en", en);
  }
  init$2({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator()
  });
}
var closeIcon = `
  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
  </svg>
`;
function add_css$i(target) {
  append_styles(target, "svelte-1ubf722", ".close-button.svelte-1ubf722.svelte-1ubf722{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;height:2rem;width:2rem;border-radius:2rem;cursor:pointer;color:var(--onboard-close-button-color, inherit)}.close-button.svelte-1ubf722.svelte-1ubf722:hover::before{opacity:0.2}.close-button.svelte-1ubf722:hover .svg-box.svelte-1ubf722{opacity:1}.close-button.svelte-1ubf722.svelte-1ubf722::before{content:'';position:absolute;height:inherit;width:inherit;opacity:0.1;background:currentColor;transition:300ms ease-in-out opacity}.svg-box.svelte-1ubf722.svelte-1ubf722{position:absolute;height:1.5rem;width:1.5rem;opacity:0.6;transition:300ms ease-in-out opacity}");
}
function create_fragment$i(ctx) {
  let div1;
  let div0;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      attr(div0, "class", "svg-box svelte-1ubf722");
      attr(div1, "class", "close-button svelte-1ubf722");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      div0.innerHTML = closeIcon;
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div1);
    }
  };
}
class CloseButton extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, null, create_fragment$i, safe_not_equal, {}, add_css$i);
  }
}
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function quartOut(t) {
  return Math.pow(t - 1, 3) * (1 - t) + 1;
}
function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const od = target_opacity * (1 - opacity);
  const [xValue, xUnit] = split_css_unit(x);
  const [yValue, yUnit] = split_css_unit(y);
  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
			opacity: ${target_opacity - od * u}`
  };
}
function slide(node, { delay = 0, duration = 400, easing = cubicOut, axis = "y" } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const primary_property = axis === "y" ? "height" : "width";
  const primary_property_value = parseFloat(style[primary_property]);
  const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
  const capitalized_secondary_properties = secondary_properties.map((e) => `${e[0].toUpperCase()}${e.slice(1)}`);
  const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
  const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
  const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
  const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
  const border_width_start_value = parseFloat(style[`border${capitalized_secondary_properties[0]}Width`]);
  const border_width_end_value = parseFloat(style[`border${capitalized_secondary_properties[1]}Width`]);
  return {
    delay,
    duration,
    easing,
    css: (t) => `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};${primary_property}: ${t * primary_property_value}px;padding-${secondary_properties[0]}: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${t * padding_end_value}px;margin-${secondary_properties[0]}: ${t * margin_start_value}px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
  };
}
function add_css$h(target) {
  append_styles(target, "svelte-7ee2g7", "section.svelte-7ee2g7{top:0;left:0;pointer-events:none;z-index:var(--onboard-modal-z-index, var(--modal-z-index))}.background.svelte-7ee2g7{background:var(--onboard-modal-backdrop, var(--modal-backdrop));pointer-events:all}.full-screen-background.svelte-7ee2g7{width:100vw;height:100vh;height:100dvh}.max-height.svelte-7ee2g7{max-height:calc(100vh - 2rem)}.modal-position.svelte-7ee2g7{top:var(--onboard-modal-top, var(--modal-top));bottom:var(--onboard-modal-bottom, var(--modal-bottom));left:var(--onboard-modal-left, var(--modal-left));right:var(--onboard-modal-right, var(--modal-right))}.modal-overflow.svelte-7ee2g7{overflow:hidden}.modal-styling.svelte-7ee2g7{--border-radius:var(\n      --onboard-modal-border-radius,\n      var(--w3o-border-radius, 1rem)\n    );border-radius:var(--border-radius) var(--border-radius) 0 0;box-shadow:var(--onboard-modal-box-shadow, var(--box-shadow-0));max-width:100vw}.modal.svelte-7ee2g7{overflow-y:auto;background:var(--onboard-modal-background, white);color:var(--onboard-modal-color, initial)}.width-100.svelte-7ee2g7{width:100%}.modal-container-mobile.svelte-7ee2g7{bottom:0}@media all and (min-width: 768px){.modal-styling.svelte-7ee2g7{border-radius:var(--border-radius)}.modal-container-mobile.svelte-7ee2g7{bottom:unset;margin:1rem}.width-100.svelte-7ee2g7{width:unset}}");
}
function create_fragment$h(ctx) {
  let section;
  let div4;
  let div3;
  let div2;
  let div1;
  let div0;
  let section_transition;
  let current2;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      section = element("section");
      div4 = element("div");
      div3 = element("div");
      div2 = element("div");
      div1 = element("div");
      div0 = element("div");
      if (default_slot) default_slot.c();
      attr(div0, "class", "modal relative svelte-7ee2g7");
      attr(div1, "class", "modal-overflow modal-styling relative flex justify-center svelte-7ee2g7");
      attr(div1, "style", `${/*connectContainerEl*/
      ctx[1] ? "max-width: 100%;" : ""}`);
      attr(div2, "class", "flex relative max-height svelte-7ee2g7");
      toggle_class(
        div2,
        "width-100",
        /*connectContainerEl*/
        ctx[1]
      );
      attr(div3, "class", "modal-container-mobile modal-position flex svelte-7ee2g7");
      toggle_class(div3, "absolute", !/*connectContainerEl*/
      ctx[1]);
      toggle_class(
        div3,
        "width-100",
        /*connectContainerEl*/
        ctx[1]
      );
      attr(div4, "class", "background flex items-center justify-center relative svelte-7ee2g7");
      toggle_class(div4, "full-screen-background", !/*connectContainerEl*/
      ctx[1]);
      attr(section, "class", "svelte-7ee2g7");
      toggle_class(section, "fixed", !/*connectContainerEl*/
      ctx[1]);
    },
    m(target, anchor) {
      insert(target, section, anchor);
      append(section, div4);
      append(div4, div3);
      append(div3, div2);
      append(div2, div1);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current2 = true;
      if (!mounted) {
        dispose = [
          listen(div2, "click", stop_propagation(
            /*click_handler*/
            ctx[4]
          )),
          listen(div4, "click", function() {
            if (is_function(
              /*close*/
              ctx[0]
            )) ctx[0].apply(this, arguments);
          })
        ];
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      if (default_slot) {
        if (default_slot.p && (!current2 || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx,
            /*$$scope*/
            ctx[2],
            !current2 ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx[2],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current2) return;
      transition_in(default_slot, local);
      add_render_callback(() => {
        if (!current2) return;
        if (!section_transition) section_transition = create_bidirectional_transition(section, fade, {}, true);
        section_transition.run(1);
      });
      current2 = true;
    },
    o(local) {
      transition_out(default_slot, local);
      if (!section_transition) section_transition = create_bidirectional_transition(section, fade, {}, false);
      section_transition.run(0);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(section);
      if (default_slot) default_slot.d(detaching);
      if (detaching && section_transition) section_transition.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$h($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const connectContainerEl = !!configuration.containerElements.connectModal;
  const html = document.documentElement;
  onMount(() => {
    if (!connectContainerEl) {
      html.style.position = "sticky";
      html.style.overflow = "hidden";
    }
  });
  onDestroy(() => {
    if (!connectContainerEl) {
      html.style.position = "";
      html.style.removeProperty("overflow");
    }
  });
  let { close } = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("close" in $$props2) $$invalidate(0, close = $$props2.close);
    if ("$$scope" in $$props2) $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [close, connectContainerEl, $$scope, slots, click_handler];
}
class Modal extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$h, create_fragment$h, safe_not_equal, { close: 0 }, add_css$h);
  }
}
function add_css$g(target) {
  append_styles(target, "svelte-tz7ru1", ".container.svelte-tz7ru1{padding:var(--onboard-spacing-4, var(--spacing-4));font-size:var(--onboard-font-size-6, var(--font-size-6));line-height:24px}input.svelte-tz7ru1{height:1rem;width:1rem;margin-right:0.5rem}");
}
function create_if_block$a(ctx) {
  let div;
  let label;
  let input;
  let t0;
  let span;
  let t1_value = (
    /*$_*/
    ctx[1]("connect.selectingWallet.agreement.agree") + ""
  );
  let t1;
  let t2;
  let t3_value = " ";
  let t3;
  let t4;
  let t5;
  let mounted;
  let dispose;
  let if_block0 = (
    /*termsUrl*/
    ctx[3] && create_if_block_2$4(ctx)
  );
  let if_block1 = (
    /*privacyUrl*/
    ctx[4] && create_if_block_1$5(ctx)
  );
  return {
    c() {
      div = element("div");
      label = element("label");
      input = element("input");
      t0 = space();
      span = element("span");
      t1 = text(t1_value);
      t2 = space();
      t3 = text(t3_value);
      t4 = space();
      if (if_block0) if_block0.c();
      t5 = space();
      if (if_block1) if_block1.c();
      attr(input, "class", " svelte-tz7ru1");
      attr(input, "type", "checkbox");
      attr(label, "class", "flex");
      attr(div, "class", "container flex items-center svelte-tz7ru1");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, label);
      append(label, input);
      input.checked = /*agreed*/
      ctx[0];
      append(label, t0);
      append(label, span);
      append(span, t1);
      append(span, t2);
      append(span, t3);
      append(span, t4);
      if (if_block0) if_block0.m(span, null);
      append(span, t5);
      if (if_block1) if_block1.m(span, null);
      if (!mounted) {
        dispose = listen(
          input,
          "change",
          /*input_change_handler*/
          ctx[6]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*agreed*/
      1) {
        input.checked = /*agreed*/
        ctx2[0];
      }
      if (dirty & /*$_*/
      2 && t1_value !== (t1_value = /*$_*/
      ctx2[1]("connect.selectingWallet.agreement.agree") + "")) set_data(t1, t1_value);
      if (
        /*termsUrl*/
        ctx2[3]
      ) if_block0.p(ctx2, dirty);
      if (
        /*privacyUrl*/
        ctx2[4]
      ) if_block1.p(ctx2, dirty);
    },
    d(detaching) {
      if (detaching) detach(div);
      if (if_block0) if_block0.d();
      if (if_block1) if_block1.d();
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_2$4(ctx) {
  let a;
  let t0_value = (
    /*$_*/
    ctx[1]("connect.selectingWallet.agreement.terms") + ""
  );
  let t0;
  let t1_value = (
    /*privacyUrl*/
    ctx[4] ? " " + /*$_*/
    ctx[1]("connect.selectingWallet.agreement.and") + " " : "."
  );
  let t1;
  return {
    c() {
      a = element("a");
      t0 = text(t0_value);
      t1 = text(t1_value);
      attr(
        a,
        "href",
        /*termsUrl*/
        ctx[3]
      );
      attr(a, "target", "_blank");
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t0);
      insert(target, t1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*$_*/
      2 && t0_value !== (t0_value = /*$_*/
      ctx2[1]("connect.selectingWallet.agreement.terms") + "")) set_data(t0, t0_value);
      if (dirty & /*$_*/
      2 && t1_value !== (t1_value = /*privacyUrl*/
      ctx2[4] ? " " + /*$_*/
      ctx2[1]("connect.selectingWallet.agreement.and") + " " : ".")) set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) detach(a);
      if (detaching) detach(t1);
    }
  };
}
function create_if_block_1$5(ctx) {
  let a;
  let t0_value = (
    /*$_*/
    ctx[1]("connect.selectingWallet.agreement.privacy") + ""
  );
  let t0;
  let t1;
  return {
    c() {
      a = element("a");
      t0 = text(t0_value);
      t1 = text(".");
      attr(
        a,
        "href",
        /*privacyUrl*/
        ctx[4]
      );
      attr(a, "target", "_blank");
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t0);
      insert(target, t1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*$_*/
      2 && t0_value !== (t0_value = /*$_*/
      ctx2[1]("connect.selectingWallet.agreement.privacy") + "")) set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching) detach(a);
      if (detaching) detach(t1);
    }
  };
}
function create_fragment$g(ctx) {
  let if_block_anchor;
  let if_block = (
    /*showTermsOfService*/
    ctx[5] && create_if_block$a(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (
        /*showTermsOfService*/
        ctx2[5]
      ) if_block.p(ctx2, dirty);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function instance$g($$self, $$props, $$invalidate) {
  let $appMetadata$;
  let $_;
  component_subscribe($$self, $format, ($$value) => $$invalidate(1, $_ = $$value));
  let { agreed } = $$props;
  const { terms: termsAgreed, privacy: privacyAgreed, version: versionAgreed } = JSON.parse(getLocalStore(STORAGE_KEYS.TERMS_AGREEMENT) || "{}");
  const blankAgreement = {
    termsUrl: "",
    privacyUrl: "",
    version: ""
  };
  const appMetadata$ = state.select("appMetadata").pipe(startWith$1(state.get().appMetadata), shareReplay$1(1));
  component_subscribe($$self, appMetadata$, (value) => $$invalidate(7, $appMetadata$ = value));
  const { termsUrl, privacyUrl, version } = $appMetadata$ && $appMetadata$.agreement || blankAgreement;
  const showTermsOfService = !!(termsUrl && !termsAgreed || privacyUrl && !privacyAgreed || version && version !== versionAgreed);
  agreed = !showTermsOfService;
  function input_change_handler() {
    agreed = this.checked;
    $$invalidate(0, agreed);
  }
  $$self.$$set = ($$props2) => {
    if ("agreed" in $$props2) $$invalidate(0, agreed = $$props2.agreed);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*agreed*/
    1) {
      if (agreed) {
        setLocalStore(STORAGE_KEYS.TERMS_AGREEMENT, JSON.stringify({
          version,
          terms: !!termsUrl,
          privacy: !!privacyUrl
        }));
      } else if (agreed === false) {
        delLocalStore(STORAGE_KEYS.TERMS_AGREEMENT);
      }
    }
  };
  return [
    agreed,
    $_,
    appMetadata$,
    termsUrl,
    privacyUrl,
    showTermsOfService,
    input_change_handler
  ];
}
class Agreement extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$g, create_fragment$g, safe_not_equal, { agreed: 0 }, add_css$g);
  }
}
function add_css$f(target) {
  append_styles(target, "svelte-2btye1", ".icon.svelte-2btye1{color:var(--onboard-white, var(--white));border-radius:50px;bottom:-0.25rem;right:-0.25rem}.yellow.svelte-2btye1{background:var(--onboard-warning-500, var(--warning-500))}");
}
function create_fragment$f(ctx) {
  let div;
  let div_class_value;
  let div_style_value;
  return {
    c() {
      div = element("div");
      attr(div, "class", div_class_value = null_to_empty(`${/*className*/
      ctx[2]} icon flex absolute`) + " svelte-2btye1");
      attr(div, "style", div_style_value = `width: ${/*size*/
      ctx[0]}px; height: ${/*size*/
      ctx[0]}px; padding: ${/*size*/
      ctx[0] / 6}px;`);
      toggle_class(
        div,
        "yellow",
        /*color*/
        ctx[1] === "yellow"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      div.innerHTML = pendingIcon;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*className*/
      4 && div_class_value !== (div_class_value = null_to_empty(`${/*className*/
      ctx2[2]} icon flex absolute`) + " svelte-2btye1")) {
        attr(div, "class", div_class_value);
      }
      if (dirty & /*size*/
      1 && div_style_value !== (div_style_value = `width: ${/*size*/
      ctx2[0]}px; height: ${/*size*/
      ctx2[0]}px; padding: ${/*size*/
      ctx2[0] / 6}px;`)) {
        attr(div, "style", div_style_value);
      }
      if (dirty & /*className, color*/
      6) {
        toggle_class(
          div,
          "yellow",
          /*color*/
          ctx2[1] === "yellow"
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  let { size } = $$props;
  let { color = "yellow" } = $$props;
  let { class: className = "test" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("size" in $$props2) $$invalidate(0, size = $$props2.size);
    if ("color" in $$props2) $$invalidate(1, color = $$props2.color);
    if ("class" in $$props2) $$invalidate(2, className = $$props2.class);
  };
  return [size, color, className];
}
class PendingStatusIcon extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$f, create_fragment$f, safe_not_equal, { size: 0, color: 1, class: 2 }, add_css$f);
  }
}
function add_css$e(target) {
  append_styles(target, "svelte-1bikw7k", ".icon.svelte-1bikw7k{color:var(--onboard-white, var(--white));border-radius:50px}.green.svelte-1bikw7k{background:var(--onboard-success-600, var(--success-600))}.blue.svelte-1bikw7k{background:var(--onboard-primary-1, var(--primary-1))}");
}
function create_fragment$e(ctx) {
  let div;
  let div_style_value;
  return {
    c() {
      div = element("div");
      attr(div, "class", "icon flex svelte-1bikw7k");
      attr(div, "style", div_style_value = `width: ${/*size*/
      ctx[0]}px; height: ${/*size*/
      ctx[0]}px; padding: ${/*size*/
      ctx[0] / 5}px;`);
      toggle_class(
        div,
        "green",
        /*color*/
        ctx[1] === "green"
      );
      toggle_class(
        div,
        "blue",
        /*color*/
        ctx[1] === "blue"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      div.innerHTML = successIcon;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*size*/
      1 && div_style_value !== (div_style_value = `width: ${/*size*/
      ctx2[0]}px; height: ${/*size*/
      ctx2[0]}px; padding: ${/*size*/
      ctx2[0] / 5}px;`)) {
        attr(div, "style", div_style_value);
      }
      if (dirty & /*color*/
      2) {
        toggle_class(
          div,
          "green",
          /*color*/
          ctx2[1] === "green"
        );
      }
      if (dirty & /*color*/
      2) {
        toggle_class(
          div,
          "blue",
          /*color*/
          ctx2[1] === "blue"
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}
function instance$e($$self, $$props, $$invalidate) {
  let { size } = $$props;
  let { color = "green" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("size" in $$props2) $$invalidate(0, size = $$props2.size);
    if ("color" in $$props2) $$invalidate(1, color = $$props2.color);
  };
  return [size, color];
}
class SuccessStatusIcon extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$e, create_fragment$e, safe_not_equal, { size: 0, color: 1 }, add_css$e);
  }
}
function add_css$d(target) {
  append_styles(target, "svelte-1le5672", ".loading-container.svelte-1le5672.svelte-1le5672{font-family:inherit;font-size:inherit;color:inherit}span.svelte-1le5672.svelte-1le5672{font-family:inherit;font-size:0.889em;margin-top:1rem}.loading.svelte-1le5672.svelte-1le5672{display:inline-block}.loading.svelte-1le5672 div.svelte-1le5672{font-size:inherit;display:block;position:absolute;border:3px solid;border-radius:50%;animation:svelte-1le5672-bn-loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;border-color:currentColor transparent transparent transparent}.loading.svelte-1le5672 .loading-first.svelte-1le5672{animation-delay:-0.45s}.loading.svelte-1le5672 .loading-second.svelte-1le5672{animation-delay:-0.3s}.loading.svelte-1le5672 .loading-third.svelte-1le5672{animation-delay:-0.15s}@keyframes svelte-1le5672-bn-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}");
}
function create_if_block$9(ctx) {
  let span;
  let t;
  return {
    c() {
      span = element("span");
      t = text(
        /*description*/
        ctx[0]
      );
      attr(span, "class", "svelte-1le5672");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*description*/
      1) set_data(
        t,
        /*description*/
        ctx2[0]
      );
    },
    d(detaching) {
      if (detaching) detach(span);
    }
  };
}
function create_fragment$d(ctx) {
  let div4;
  let div3;
  let div0;
  let div0_style_value;
  let t0;
  let div1;
  let div1_style_value;
  let t1;
  let div2;
  let div2_style_value;
  let div3_style_value;
  let t2;
  let if_block = (
    /*description*/
    ctx[0] && create_if_block$9(ctx)
  );
  return {
    c() {
      div4 = element("div");
      div3 = element("div");
      div0 = element("div");
      t0 = space();
      div1 = element("div");
      t1 = space();
      div2 = element("div");
      t2 = space();
      if (if_block) if_block.c();
      attr(div0, "class", "loading-first svelte-1le5672");
      attr(div0, "style", div0_style_value = `height: ${/*size*/
      ctx[1]}; width: ${/*size*/
      ctx[1]};`);
      attr(div1, "class", "loading-second svelte-1le5672");
      attr(div1, "style", div1_style_value = `height: ${/*size*/
      ctx[1]}; width: ${/*size*/
      ctx[1]};`);
      attr(div2, "class", "loading-third svelte-1le5672");
      attr(div2, "style", div2_style_value = `height: ${/*size*/
      ctx[1]}; width: ${/*size*/
      ctx[1]};`);
      attr(div3, "class", "loading relative svelte-1le5672");
      attr(div3, "style", div3_style_value = `height: ${/*size*/
      ctx[1]}; width: ${/*size*/
      ctx[1]};`);
      attr(div4, "class", "loading-container flex flex-column justify-center items-center absolute svelte-1le5672");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div3);
      append(div3, div0);
      append(div3, t0);
      append(div3, div1);
      append(div3, t1);
      append(div3, div2);
      append(div4, t2);
      if (if_block) if_block.m(div4, null);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*size*/
      2 && div0_style_value !== (div0_style_value = `height: ${/*size*/
      ctx2[1]}; width: ${/*size*/
      ctx2[1]};`)) {
        attr(div0, "style", div0_style_value);
      }
      if (dirty & /*size*/
      2 && div1_style_value !== (div1_style_value = `height: ${/*size*/
      ctx2[1]}; width: ${/*size*/
      ctx2[1]};`)) {
        attr(div1, "style", div1_style_value);
      }
      if (dirty & /*size*/
      2 && div2_style_value !== (div2_style_value = `height: ${/*size*/
      ctx2[1]}; width: ${/*size*/
      ctx2[1]};`)) {
        attr(div2, "style", div2_style_value);
      }
      if (dirty & /*size*/
      2 && div3_style_value !== (div3_style_value = `height: ${/*size*/
      ctx2[1]}; width: ${/*size*/
      ctx2[1]};`)) {
        attr(div3, "style", div3_style_value);
      }
      if (
        /*description*/
        ctx2[0]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$9(ctx2);
          if_block.c();
          if_block.m(div4, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div4);
      if (if_block) if_block.d();
    }
  };
}
function instance$d($$self, $$props, $$invalidate) {
  let { description = "" } = $$props;
  let { size = "2rem" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("description" in $$props2) $$invalidate(0, description = $$props2.description);
    if ("size" in $$props2) $$invalidate(1, size = $$props2.size);
  };
  return [description, size];
}
class Spinner extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$d, create_fragment$d, safe_not_equal, { description: 0, size: 1 }, add_css$d);
  }
}
function add_css$c(target) {
  append_styles(target, "svelte-i129jl", ".icon.svelte-i129jl{height:100%}.border-custom.svelte-i129jl{border:1px solid var(--border-color)}.border-yellow.svelte-i129jl{border:1px solid var(--onboard-warning-500, var(--warning-500))}.border-gray.svelte-i129jl{border:1px solid var(--onboard-gray-400, var(--gray-400))}.border-green.svelte-i129jl{border:1px solid var(--onboard-success-500, var(--success-500))}.border-dark-green.svelte-i129jl{border:1px solid var(--onboard-success-700, var(--success-700))}.border-blue.svelte-i129jl{border:1px solid\n      var(\n        --onboard-wallet-app-icon-border-color,\n        var(--onboard-primary-300, var(--primary-300))\n      )}.border-dark-blue.svelte-i129jl{border:1px solid\n      var(\n        --onboard-wallet-app-icon-border-color,\n        var(--onboard-primary-600, var(--primary-600))\n      )}.border-transparent.svelte-i129jl{border:1px solid transparent}.border-black.svelte-i129jl{border:1px solid var(--onboard-gray-600, var(--gray-600))}.background-gray.svelte-i129jl{background:var(\n      --onboard-wallet-app-icon-background-gray,\n      var(--onboard-gray-500, var(--gray-500))\n    )}.background-light-gray.svelte-i129jl{background:var(\n      --onboard-wallet-app-icon-background-light-gray,\n      var(--onboard-gray-100, var(--gray-100))\n    )}.background-light-blue.svelte-i129jl{background:var(\n      --onboard-wallet-app-icon-background-light-blue,\n      var(--onboard-primary-100, var(--primary-100))\n    )}.background-green.svelte-i129jl{background:var(\n      --onboard-wallet-app-icon-background-green,\n      var(--onboard-success-100, var(--success-100))\n    )}.background-white.svelte-i129jl{background:var(\n      --onboard-wallet-app-icon-background-white,\n      var(--onboard-white, var(--white))\n    )}.background-transparent.svelte-i129jl{background:var(\n      --onboard-wallet-app-icon-background-transparent,\n      transparent\n    )}@keyframes svelte-i129jl-pulse{from{opacity:0}to{opacity:1}}.placeholder-icon.svelte-i129jl{width:100%;height:100%;background:var(--onboard-gray-100, var(--gray-100));border-radius:32px;animation:svelte-i129jl-pulse infinite 750ms alternate ease-in-out}.spinner-container.svelte-i129jl{color:var(--onboard-primary-300, var(--primary-300))}img.svelte-i129jl{max-width:100%;height:auto}.pending-status-icon{z-index:1;fill:white;box-shadow:0px 2px 12px 0px rgba(0, 0, 0, 0.1)}.status-icon-container.svelte-i129jl{right:-0.25rem;bottom:-0.25rem;position:absolute}");
}
const get_status_slot_changes = (dirty) => ({});
const get_status_slot_context = (ctx) => ({});
function create_else_block$4(ctx) {
  let await_block_anchor;
  let promise2;
  let current2;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block$1,
    then: create_then_block$1,
    catch: create_catch_block$1,
    value: 13,
    blocks: [, , ,]
  };
  handle_promise(promise2 = /*icon*/
  ctx[1], info);
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target, anchor) {
      insert(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current2 = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      info.ctx = ctx;
      if (dirty & /*icon*/
      2 && promise2 !== (promise2 = /*icon*/
      ctx[1]) && handle_promise(promise2, info)) ;
      else {
        update_await_block_branch(info, ctx, dirty);
      }
    },
    i(local) {
      if (current2) return;
      transition_in(info.block);
      current2 = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(await_block_anchor);
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function create_if_block$8(ctx) {
  let div;
  let spinner;
  let current2;
  spinner = new Spinner({ props: { size: "2rem" } });
  return {
    c() {
      div = element("div");
      create_component(spinner.$$.fragment);
      attr(div, "class", "spinner-container svelte-i129jl");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(spinner, div, null);
      current2 = true;
    },
    p: noop,
    i(local) {
      if (current2) return;
      transition_in(spinner.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(spinner.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(spinner);
    }
  };
}
function create_catch_block$1(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block$1(ctx) {
  let div;
  let show_if;
  let div_intro;
  let t;
  let if_block1_anchor;
  let current2;
  function select_block_type_1(ctx2, dirty) {
    if (dirty & /*icon*/
    2) show_if = null;
    if (show_if == null) show_if = !!isSVG(
      /*iconLoaded*/
      ctx2[13]
    );
    if (show_if) return create_if_block_2$3;
    return create_else_block_1$2;
  }
  let current_block_type = select_block_type_1(ctx, -1);
  let if_block0 = current_block_type(ctx);
  let if_block1 = (
    /*loading*/
    ctx[2] && /*windowWidth*/
    ctx[9] <= MOBILE_WINDOW_WIDTH && create_if_block_1$4()
  );
  return {
    c() {
      div = element("div");
      if_block0.c();
      t = space();
      if (if_block1) if_block1.c();
      if_block1_anchor = empty();
      attr(div, "class", "icon flex justify-center items-center svelte-i129jl");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_block0.m(div, null);
      insert(target, t, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx2, dirty)) && if_block0) {
        if_block0.p(ctx2, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div, null);
        }
      }
      if (
        /*loading*/
        ctx2[2] && /*windowWidth*/
        ctx2[9] <= MOBILE_WINDOW_WIDTH
      ) {
        if (if_block1) {
          if (dirty & /*loading, windowWidth*/
          516) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1$4();
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current2) return;
      if (local) {
        if (!div_intro) {
          add_render_callback(() => {
            div_intro = create_in_transition(div, fade, {});
            div_intro.start();
          });
        }
      }
      transition_in(if_block1);
      current2 = true;
    },
    o(local) {
      transition_out(if_block1);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      if_block0.d();
      if (detaching) detach(t);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(if_block1_anchor);
    }
  };
}
function create_else_block_1$2(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (!src_url_equal(img.src, img_src_value = /*iconLoaded*/
      ctx[13])) attr(img, "src", img_src_value);
      attr(img, "alt", "logo");
      attr(img, "class", "svelte-i129jl");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*icon*/
      2 && !src_url_equal(img.src, img_src_value = /*iconLoaded*/
      ctx2[13])) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching) detach(img);
    }
  };
}
function create_if_block_2$3(ctx) {
  let html_tag;
  let raw_value = (
    /*iconLoaded*/
    ctx[13] + ""
  );
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*icon*/
      2 && raw_value !== (raw_value = /*iconLoaded*/
      ctx2[13] + "")) html_tag.p(raw_value);
    },
    d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }
  };
}
function create_if_block_1$4(ctx) {
  let div;
  let pendingstatusicon;
  let current2;
  pendingstatusicon = new PendingStatusIcon({
    props: { class: "pending-status-icon", size: 20 }
  });
  return {
    c() {
      div = element("div");
      create_component(pendingstatusicon.$$.fragment);
      attr(div, "class", "status-icon-container svelte-i129jl");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(pendingstatusicon, div, null);
      current2 = true;
    },
    i(local) {
      if (current2) return;
      transition_in(pendingstatusicon.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(pendingstatusicon.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(pendingstatusicon);
    }
  };
}
function create_pending_block$1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "placeholder-icon svelte-i129jl");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}
function create_fragment$c(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let t;
  let div_style_value;
  let current2;
  let mounted;
  let dispose;
  add_render_callback(
    /*onwindowresize*/
    ctx[12]
  );
  const if_block_creators = [create_if_block$8, create_else_block$4];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*loading*/
      ctx2[2] && /*windowWidth*/
      ctx2[9] >= MOBILE_WINDOW_WIDTH
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const status_slot_template = (
    /*#slots*/
    ctx[11].status
  );
  const status_slot = create_slot(
    status_slot_template,
    ctx,
    /*$$scope*/
    ctx[10],
    get_status_slot_context
  );
  return {
    c() {
      div = element("div");
      if_block.c();
      t = space();
      if (status_slot) status_slot.c();
      attr(div, "class", "relative svelte-i129jl");
      attr(div, "style", div_style_value = `${/*background*/
      ctx[6] === "custom" ? `background-color: ${/*customBackgroundColor*/
      ctx[7]}` : ""}; padding: ${/*padding*/
      ctx[3] - 1}px; width: ${/*size*/
      ctx[0]}px; height: ${/*size*/
      ctx[0]}px; border-radius: ${/*radius*/
      ctx[8]}px; color: ${/*color*/
      ctx[4]};`);
      toggle_class(
        div,
        "border-custom",
        /*border*/
        ctx[5] === "custom"
      );
      toggle_class(
        div,
        "border-yellow",
        /*border*/
        ctx[5] === "yellow"
      );
      toggle_class(
        div,
        "border-gray",
        /*border*/
        ctx[5] === "gray"
      );
      toggle_class(
        div,
        "border-green",
        /*border*/
        ctx[5] === "green"
      );
      toggle_class(
        div,
        "border-dark-green",
        /*border*/
        ctx[5] === "darkGreen"
      );
      toggle_class(
        div,
        "border-blue",
        /*border*/
        ctx[5] === "blue"
      );
      toggle_class(
        div,
        "border-dark-blue",
        /*border*/
        ctx[5] === "darkBlue"
      );
      toggle_class(
        div,
        "border-transparent",
        /*border*/
        ctx[5] === "transparent"
      );
      toggle_class(
        div,
        "border-black",
        /*border*/
        ctx[5] === "black"
      );
      toggle_class(
        div,
        "background-gray",
        /*background*/
        ctx[6] === "gray"
      );
      toggle_class(
        div,
        "background-light-gray",
        /*background*/
        ctx[6] === "lightGray"
      );
      toggle_class(
        div,
        "background-light-blue",
        /*background*/
        ctx[6] === "lightBlue"
      );
      toggle_class(
        div,
        "background-green",
        /*background*/
        ctx[6] === "green"
      );
      toggle_class(
        div,
        "background-white",
        /*background*/
        ctx[6] === "white"
      );
      toggle_class(
        div,
        "background-transparent",
        /*background*/
        ctx[6] === "transparent"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      append(div, t);
      if (status_slot) {
        status_slot.m(div, null);
      }
      current2 = true;
      if (!mounted) {
        dispose = listen(
          window,
          "resize",
          /*onwindowresize*/
          ctx[12]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div, t);
      }
      if (status_slot) {
        if (status_slot.p && (!current2 || dirty & /*$$scope*/
        1024)) {
          update_slot_base(
            status_slot,
            status_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[10],
            !current2 ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[10]
            ) : get_slot_changes(
              status_slot_template,
              /*$$scope*/
              ctx2[10],
              dirty,
              get_status_slot_changes
            ),
            get_status_slot_context
          );
        }
      }
      if (!current2 || dirty & /*background, customBackgroundColor, padding, size, radius, color*/
      473 && div_style_value !== (div_style_value = `${/*background*/
      ctx2[6] === "custom" ? `background-color: ${/*customBackgroundColor*/
      ctx2[7]}` : ""}; padding: ${/*padding*/
      ctx2[3] - 1}px; width: ${/*size*/
      ctx2[0]}px; height: ${/*size*/
      ctx2[0]}px; border-radius: ${/*radius*/
      ctx2[8]}px; color: ${/*color*/
      ctx2[4]};`)) {
        attr(div, "style", div_style_value);
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-custom",
          /*border*/
          ctx2[5] === "custom"
        );
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-yellow",
          /*border*/
          ctx2[5] === "yellow"
        );
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-gray",
          /*border*/
          ctx2[5] === "gray"
        );
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-green",
          /*border*/
          ctx2[5] === "green"
        );
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-dark-green",
          /*border*/
          ctx2[5] === "darkGreen"
        );
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-blue",
          /*border*/
          ctx2[5] === "blue"
        );
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-dark-blue",
          /*border*/
          ctx2[5] === "darkBlue"
        );
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-transparent",
          /*border*/
          ctx2[5] === "transparent"
        );
      }
      if (!current2 || dirty & /*border*/
      32) {
        toggle_class(
          div,
          "border-black",
          /*border*/
          ctx2[5] === "black"
        );
      }
      if (!current2 || dirty & /*background*/
      64) {
        toggle_class(
          div,
          "background-gray",
          /*background*/
          ctx2[6] === "gray"
        );
      }
      if (!current2 || dirty & /*background*/
      64) {
        toggle_class(
          div,
          "background-light-gray",
          /*background*/
          ctx2[6] === "lightGray"
        );
      }
      if (!current2 || dirty & /*background*/
      64) {
        toggle_class(
          div,
          "background-light-blue",
          /*background*/
          ctx2[6] === "lightBlue"
        );
      }
      if (!current2 || dirty & /*background*/
      64) {
        toggle_class(
          div,
          "background-green",
          /*background*/
          ctx2[6] === "green"
        );
      }
      if (!current2 || dirty & /*background*/
      64) {
        toggle_class(
          div,
          "background-white",
          /*background*/
          ctx2[6] === "white"
        );
      }
      if (!current2 || dirty & /*background*/
      64) {
        toggle_class(
          div,
          "background-transparent",
          /*background*/
          ctx2[6] === "transparent"
        );
      }
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      transition_in(status_slot, local);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      transition_out(status_slot, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      if_blocks[current_block_type_index].d();
      if (status_slot) status_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { size } = $$props;
  let { icon } = $$props;
  let { loading = false } = $$props;
  let { padding = size / 6 } = $$props;
  let { color = "black" } = $$props;
  let { border = "transparent" } = $$props;
  let { background = "transparent" } = $$props;
  let { customBackgroundColor = "" } = $$props;
  let { radius = 12 } = $$props;
  let windowWidth;
  function onwindowresize() {
    $$invalidate(9, windowWidth = window.innerWidth);
  }
  $$self.$$set = ($$props2) => {
    if ("size" in $$props2) $$invalidate(0, size = $$props2.size);
    if ("icon" in $$props2) $$invalidate(1, icon = $$props2.icon);
    if ("loading" in $$props2) $$invalidate(2, loading = $$props2.loading);
    if ("padding" in $$props2) $$invalidate(3, padding = $$props2.padding);
    if ("color" in $$props2) $$invalidate(4, color = $$props2.color);
    if ("border" in $$props2) $$invalidate(5, border = $$props2.border);
    if ("background" in $$props2) $$invalidate(6, background = $$props2.background);
    if ("customBackgroundColor" in $$props2) $$invalidate(7, customBackgroundColor = $$props2.customBackgroundColor);
    if ("radius" in $$props2) $$invalidate(8, radius = $$props2.radius);
    if ("$$scope" in $$props2) $$invalidate(10, $$scope = $$props2.$$scope);
  };
  return [
    size,
    icon,
    loading,
    padding,
    color,
    border,
    background,
    customBackgroundColor,
    radius,
    windowWidth,
    $$scope,
    slots,
    onwindowresize
  ];
}
class WalletAppBadge extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(
      this,
      options2,
      instance$c,
      create_fragment$c,
      safe_not_equal,
      {
        size: 0,
        icon: 1,
        loading: 2,
        padding: 3,
        color: 4,
        border: 5,
        background: 6,
        customBackgroundColor: 7,
        radius: 8
      },
      add_css$c
    );
  }
}
function add_css$b(target) {
  append_styles(target, "svelte-q2gson", ".container.svelte-q2gson{gap:1rem;padding:0.75rem;color:var(--onboard-warning-700, var(--warning-700));font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:16px;border:1px solid var(--onboard-warning-400, var(--warning-400));background:var(--onboard-warning-100, var(--warning-100));border-radius:12px}.icon.svelte-q2gson{color:var(--onboard-warning-700, var(--warning-700));width:1rem;height:1rem;flex:0 0 auto}");
}
function create_fragment$b(ctx) {
  let div2;
  let div0;
  let t;
  let div1;
  let div2_intro;
  let current2;
  const default_slot_template = (
    /*#slots*/
    ctx[1].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[0],
    null
  );
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      if (default_slot) default_slot.c();
      t = space();
      div1 = element("div");
      attr(div1, "class", "icon svelte-q2gson");
      attr(div2, "class", "container flex justify-between svelte-q2gson");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      append(div2, t);
      append(div2, div1);
      div1.innerHTML = infoIcon;
      current2 = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current2 || dirty & /*$$scope*/
        1)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[0],
            !current2 ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[0]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[0],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current2) return;
      transition_in(default_slot, local);
      if (local) {
        if (!div2_intro) {
          add_render_callback(() => {
            div2_intro = create_in_transition(div2, slide, { delay: 50, duration: 500 });
            div2_intro.start();
          });
        }
      }
      current2 = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div2);
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2) $$invalidate(0, $$scope = $$props2.$$scope);
  };
  return [$$scope, slots];
}
class Warning extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$b, create_fragment$b, safe_not_equal, {}, add_css$b);
  }
}
function add_css$a(target) {
  append_styles(target, "svelte-1kfgpsl", ".container.svelte-1kfgpsl{padding:var(--onboard-spacing-4, var(--spacing-4));color:var(\n      --onboard-connect-accent-text-color,\n      var(--onboard-gray-700, var(--gray-700))\n    )}.connecting-container.svelte-1kfgpsl{padding:var(--onboard-spacing-4, var(--spacing-4));border-radius:var(--onboard-border-radius-1, var(--border-radius-1));background:var(--onboard-success-100, var(--success-100));border:1px solid var(--onboard-success-600, var(--success-600));width:100%}.text.svelte-1kfgpsl{right:var(--onboard-spacing-5, var(--spacing-5))}.tick.svelte-1kfgpsl{color:var(--onboard-success-700, var(--success-700))}");
}
function create_fragment$a(ctx) {
  let div7;
  let div6;
  let div4;
  let div2;
  let walletappbadge0;
  let t0;
  let div0;
  let successstatusicon;
  let t1;
  let div1;
  let walletappbadge1;
  let t2;
  let div3;
  let t3_value = (
    /*$_*/
    ctx[2]("connect.connectedWallet.mainText", {
      default: en.connect.connectedWallet.mainText,
      values: { wallet: (
        /*selectedWallet*/
        ctx[0].label
      ) }
    }) + ""
  );
  let t3;
  let t4;
  let div5;
  let current2;
  walletappbadge0 = new WalletAppBadge({
    props: {
      size: 40,
      padding: 8,
      background: (
        /*$appMetadata$*/
        ctx[1] && /*$appMetadata$*/
        ctx[1].icon ? "lightBlue" : "lightGray"
      ),
      border: "darkGreen",
      icon: (
        /*$appMetadata$*/
        ctx[1] && /*$appMetadata$*/
        ctx[1].icon || questionIcon
      )
    }
  });
  successstatusicon = new SuccessStatusIcon({ props: { size: 17 } });
  walletappbadge1 = new WalletAppBadge({
    props: {
      size: 40,
      padding: 8,
      border: "darkGreen",
      background: "white",
      icon: (
        /*selectedWallet*/
        ctx[0].icon
      )
    }
  });
  return {
    c() {
      div7 = element("div");
      div6 = element("div");
      div4 = element("div");
      div2 = element("div");
      create_component(walletappbadge0.$$.fragment);
      t0 = space();
      div0 = element("div");
      create_component(successstatusicon.$$.fragment);
      t1 = space();
      div1 = element("div");
      create_component(walletappbadge1.$$.fragment);
      t2 = space();
      div3 = element("div");
      t3 = text(t3_value);
      t4 = space();
      div5 = element("div");
      attr(div0, "class", "relative");
      set_style(div0, "right", "1rem");
      set_style(div0, "top", "4px");
      set_style(div0, "z-index", "1");
      attr(div1, "class", "relative");
      set_style(div1, "right", "1.75rem");
      attr(div2, "class", "flex justify-center items-end relative");
      attr(div3, "class", "text relative svelte-1kfgpsl");
      attr(div4, "class", "flex items-center");
      attr(div5, "class", "tick flex items-center svelte-1kfgpsl");
      set_style(div5, "width", "24px");
      attr(div6, "class", "connecting-container flex justify-between items-center svelte-1kfgpsl");
      attr(div7, "class", "container svelte-1kfgpsl");
    },
    m(target, anchor) {
      insert(target, div7, anchor);
      append(div7, div6);
      append(div6, div4);
      append(div4, div2);
      mount_component(walletappbadge0, div2, null);
      append(div2, t0);
      append(div2, div0);
      mount_component(successstatusicon, div0, null);
      append(div2, t1);
      append(div2, div1);
      mount_component(walletappbadge1, div1, null);
      append(div4, t2);
      append(div4, div3);
      append(div3, t3);
      append(div6, t4);
      append(div6, div5);
      div5.innerHTML = successIcon;
      current2 = true;
    },
    p(ctx2, [dirty]) {
      const walletappbadge0_changes = {};
      if (dirty & /*$appMetadata$*/
      2) walletappbadge0_changes.background = /*$appMetadata$*/
      ctx2[1] && /*$appMetadata$*/
      ctx2[1].icon ? "lightBlue" : "lightGray";
      if (dirty & /*$appMetadata$*/
      2) walletappbadge0_changes.icon = /*$appMetadata$*/
      ctx2[1] && /*$appMetadata$*/
      ctx2[1].icon || questionIcon;
      walletappbadge0.$set(walletappbadge0_changes);
      const walletappbadge1_changes = {};
      if (dirty & /*selectedWallet*/
      1) walletappbadge1_changes.icon = /*selectedWallet*/
      ctx2[0].icon;
      walletappbadge1.$set(walletappbadge1_changes);
      if ((!current2 || dirty & /*$_, selectedWallet*/
      5) && t3_value !== (t3_value = /*$_*/
      ctx2[2]("connect.connectedWallet.mainText", {
        default: en.connect.connectedWallet.mainText,
        values: { wallet: (
          /*selectedWallet*/
          ctx2[0].label
        ) }
      }) + "")) set_data(t3, t3_value);
    },
    i(local) {
      if (current2) return;
      transition_in(walletappbadge0.$$.fragment, local);
      transition_in(successstatusicon.$$.fragment, local);
      transition_in(walletappbadge1.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(walletappbadge0.$$.fragment, local);
      transition_out(successstatusicon.$$.fragment, local);
      transition_out(walletappbadge1.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div7);
      destroy_component(walletappbadge0);
      destroy_component(successstatusicon);
      destroy_component(walletappbadge1);
    }
  };
}
function instance$a($$self, $$props, $$invalidate) {
  let $appMetadata$;
  let $_;
  component_subscribe($$self, $format, ($$value) => $$invalidate(2, $_ = $$value));
  let { selectedWallet } = $$props;
  const appMetadata$ = state.select("appMetadata").pipe(startWith$1(state.get().appMetadata), shareReplay$1(1));
  component_subscribe($$self, appMetadata$, (value) => $$invalidate(1, $appMetadata$ = value));
  $$self.$$set = ($$props2) => {
    if ("selectedWallet" in $$props2) $$invalidate(0, selectedWallet = $$props2.selectedWallet);
  };
  return [selectedWallet, $appMetadata$, $_, appMetadata$];
}
class ConnectedWallet extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$a, create_fragment$a, safe_not_equal, { selectedWallet: 0 }, add_css$a);
  }
}
function add_css$9(target) {
  append_styles(target, "svelte-j1ywa3", ".container.svelte-j1ywa3{padding:var(--onboard-spacing-4, var(--spacing-4))}.connecting-container.svelte-j1ywa3{width:100%;padding:var(--onboard-spacing-4, var(--spacing-4));transition:background-color 100ms ease-in-out,\n      border-color 100ms ease-in-out;border-radius:24px;background:var(--onboard-primary-100, var(--primary-100));border:1px solid;border-color:var(--onboard-primary-300, var(--primary-300));color:var(--onboard-gray-600, var(--gray-600))}.connecting-container.warning.svelte-j1ywa3{background:var(--onboard-warning-100, var(--warning-100));border-color:var(--onboard-warning-400, var(--warning-400))}.text.svelte-j1ywa3{line-height:16px;margin-bottom:var(--onboard-spacing-5, var(--spacing-5))}.text.text-rejected.svelte-j1ywa3{line-height:24px;margin-bottom:0}.subtext.svelte-j1ywa3{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:16px}.rejected-cta.svelte-j1ywa3{color:var(--onboard-primary-500, var(--primary-500))}.onboard-button-primary.svelte-j1ywa3{bottom:var(--onboard-spacing-3, var(--spacing-3))}.ml.svelte-j1ywa3{margin-left:var(--onboard-spacing-4, var(--spacing-4))}@media all and (max-width: 520px){.connecting-container.svelte-j1ywa3{border-radius:var(--onboard-border-radius-4, var(--border-radius-4))}.container.svelte-j1ywa3{padding-bottom:0}.wallet-badges.svelte-j1ywa3{display:none}.connecting-wallet-info.svelte-j1ywa3{margin:0}.onboard-button-primary.svelte-j1ywa3{display:none}}");
}
function create_else_block$3(ctx) {
  let div;
  let t_value = (
    /*$_*/
    ctx[7](
      `connect.connectingWallet.${/*previousConnectionRequest*/
      ctx[5] ? "previousConnection" : "paragraph"}`,
      {
        default: en.connect.connectingWallet.paragraph,
        values: { wallet: (
          /*selectedWallet*/
          ctx[1].label
        ) }
      }
    ) + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "subtext svelte-j1ywa3");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*$_, previousConnectionRequest, selectedWallet*/
      162 && t_value !== (t_value = /*$_*/
      ctx2[7](
        `connect.connectingWallet.${/*previousConnectionRequest*/
        ctx2[5] ? "previousConnection" : "paragraph"}`,
        {
          default: en.connect.connectingWallet.paragraph,
          values: { wallet: (
            /*selectedWallet*/
            ctx2[1].label
          ) }
        }
      ) + "")) set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}
function create_if_block$7(ctx) {
  let div;
  let t_value = (
    /*$_*/
    ctx[7]("connect.connectingWallet.rejectedCTA", {
      default: en.connect.connectingWallet.rejectedCTA,
      values: { wallet: (
        /*selectedWallet*/
        ctx[1].label
      ) }
    }) + ""
  );
  let t;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "rejected-cta pointer subtext svelte-j1ywa3");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
      if (!mounted) {
        dispose = listen(div, "click", function() {
          if (is_function(
            /*connectWallet*/
            ctx[0]
          )) ctx[0].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*$_, selectedWallet*/
      130 && t_value !== (t_value = /*$_*/
      ctx[7]("connect.connectingWallet.rejectedCTA", {
        default: en.connect.connectingWallet.rejectedCTA,
        values: { wallet: (
          /*selectedWallet*/
          ctx[1].label
        ) }
      }) + "")) set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) detach(div);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$9(ctx) {
  let div6;
  let div5;
  let div4;
  let div1;
  let walletappbadge0;
  let t0;
  let div0;
  let walletappbadge1;
  let t1;
  let div3;
  let div2;
  let t2_value = (
    /*$_*/
    ctx[7](
      `connect.connectingWallet.${/*connectionRejected*/
      ctx[4] ? "rejectedText" : "mainText"}`,
      {
        default: (
          /*connectionRejected*/
          ctx[4] ? en.connect.connectingWallet.rejectedText : en.connect.connectingWallet.mainText
        ),
        values: { wallet: (
          /*selectedWallet*/
          ctx[1].label
        ) }
      }
    ) + ""
  );
  let t2;
  let t3;
  let t4;
  let button;
  let t5_value = (
    /*$_*/
    ctx[7]("connect.connectingWallet.primaryButton", {
      default: en.connect.connectingWallet.primaryButton
    }) + ""
  );
  let t5;
  let current2;
  let mounted;
  let dispose;
  walletappbadge0 = new WalletAppBadge({
    props: {
      size: 40,
      padding: 8,
      icon: (
        /*$appMetadata$*/
        ctx[6] && /*$appMetadata$*/
        ctx[6].icon || questionIcon
      ),
      border: (
        /*connectionRejected*/
        ctx[4] || /*previousConnectionRequest*/
        ctx[5] ? "yellow" : "blue"
      ),
      background: "lightGray"
    }
  });
  walletappbadge1 = new WalletAppBadge({
    props: {
      size: 40,
      padding: 8,
      border: (
        /*connectionRejected*/
        ctx[4] || /*previousConnectionRequest*/
        ctx[5] ? "yellow" : "blue"
      ),
      background: "white",
      icon: (
        /*selectedWallet*/
        ctx[1].icon
      )
    }
  });
  function select_block_type(ctx2, dirty) {
    if (
      /*connectionRejected*/
      ctx2[4]
    ) return create_if_block$7;
    return create_else_block$3;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      div6 = element("div");
      div5 = element("div");
      div4 = element("div");
      div1 = element("div");
      create_component(walletappbadge0.$$.fragment);
      t0 = space();
      div0 = element("div");
      create_component(walletappbadge1.$$.fragment);
      t1 = space();
      div3 = element("div");
      div2 = element("div");
      t2 = text(t2_value);
      t3 = space();
      if_block.c();
      t4 = space();
      button = element("button");
      t5 = text(t5_value);
      attr(div0, "class", "relative");
      set_style(div0, "right", "0.5rem");
      attr(div1, "class", "flex justify-center relative wallet-badges svelte-j1ywa3");
      attr(div2, "class", "text svelte-j1ywa3");
      toggle_class(
        div2,
        "text-rejected",
        /*connectionRejected*/
        ctx[4]
      );
      attr(div3, "class", "flex flex-column justify-center ml connecting-wallet-info svelte-j1ywa3");
      attr(div4, "class", "flex");
      attr(div5, "class", "connecting-container flex justify-between items-center svelte-j1ywa3");
      toggle_class(
        div5,
        "warning",
        /*connectionRejected*/
        ctx[4] || /*previousConnectionRequest*/
        ctx[5]
      );
      attr(button, "class", "onboard-button-primary absolute svelte-j1ywa3");
      attr(div6, "class", "container flex flex-column items-center svelte-j1ywa3");
    },
    m(target, anchor) {
      insert(target, div6, anchor);
      append(div6, div5);
      append(div5, div4);
      append(div4, div1);
      mount_component(walletappbadge0, div1, null);
      append(div1, t0);
      append(div1, div0);
      mount_component(walletappbadge1, div0, null);
      append(div4, t1);
      append(div4, div3);
      append(div3, div2);
      append(div2, t2);
      append(div3, t3);
      if_block.m(div3, null);
      append(div6, t4);
      append(div6, button);
      append(button, t5);
      current2 = true;
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler*/
          ctx[9]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const walletappbadge0_changes = {};
      if (dirty & /*$appMetadata$*/
      64) walletappbadge0_changes.icon = /*$appMetadata$*/
      ctx2[6] && /*$appMetadata$*/
      ctx2[6].icon || questionIcon;
      if (dirty & /*connectionRejected, previousConnectionRequest*/
      48) walletappbadge0_changes.border = /*connectionRejected*/
      ctx2[4] || /*previousConnectionRequest*/
      ctx2[5] ? "yellow" : "blue";
      walletappbadge0.$set(walletappbadge0_changes);
      const walletappbadge1_changes = {};
      if (dirty & /*connectionRejected, previousConnectionRequest*/
      48) walletappbadge1_changes.border = /*connectionRejected*/
      ctx2[4] || /*previousConnectionRequest*/
      ctx2[5] ? "yellow" : "blue";
      if (dirty & /*selectedWallet*/
      2) walletappbadge1_changes.icon = /*selectedWallet*/
      ctx2[1].icon;
      walletappbadge1.$set(walletappbadge1_changes);
      if ((!current2 || dirty & /*$_, connectionRejected, selectedWallet*/
      146) && t2_value !== (t2_value = /*$_*/
      ctx2[7](
        `connect.connectingWallet.${/*connectionRejected*/
        ctx2[4] ? "rejectedText" : "mainText"}`,
        {
          default: (
            /*connectionRejected*/
            ctx2[4] ? en.connect.connectingWallet.rejectedText : en.connect.connectingWallet.mainText
          ),
          values: { wallet: (
            /*selectedWallet*/
            ctx2[1].label
          ) }
        }
      ) + "")) set_data(t2, t2_value);
      if (!current2 || dirty & /*connectionRejected*/
      16) {
        toggle_class(
          div2,
          "text-rejected",
          /*connectionRejected*/
          ctx2[4]
        );
      }
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(div3, null);
        }
      }
      if (!current2 || dirty & /*connectionRejected, previousConnectionRequest*/
      48) {
        toggle_class(
          div5,
          "warning",
          /*connectionRejected*/
          ctx2[4] || /*previousConnectionRequest*/
          ctx2[5]
        );
      }
      if ((!current2 || dirty & /*$_*/
      128) && t5_value !== (t5_value = /*$_*/
      ctx2[7]("connect.connectingWallet.primaryButton", {
        default: en.connect.connectingWallet.primaryButton
      }) + "")) set_data(t5, t5_value);
    },
    i(local) {
      if (current2) return;
      transition_in(walletappbadge0.$$.fragment, local);
      transition_in(walletappbadge1.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(walletappbadge0.$$.fragment, local);
      transition_out(walletappbadge1.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div6);
      destroy_component(walletappbadge0);
      destroy_component(walletappbadge1);
      if_block.d();
      mounted = false;
      dispose();
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let $appMetadata$;
  let $_;
  component_subscribe($$self, $format, ($$value) => $$invalidate(7, $_ = $$value));
  let { connectWallet } = $$props;
  let { selectedWallet } = $$props;
  let { deselectWallet } = $$props;
  let { setStep } = $$props;
  let { connectionRejected } = $$props;
  let { previousConnectionRequest } = $$props;
  const appMetadata$ = state.select("appMetadata").pipe(startWith$1(state.get().appMetadata), shareReplay$1(1));
  component_subscribe($$self, appMetadata$, (value) => $$invalidate(6, $appMetadata$ = value));
  const click_handler = () => {
    deselectWallet(selectedWallet.label);
    setStep("selectingWallet");
  };
  $$self.$$set = ($$props2) => {
    if ("connectWallet" in $$props2) $$invalidate(0, connectWallet = $$props2.connectWallet);
    if ("selectedWallet" in $$props2) $$invalidate(1, selectedWallet = $$props2.selectedWallet);
    if ("deselectWallet" in $$props2) $$invalidate(2, deselectWallet = $$props2.deselectWallet);
    if ("setStep" in $$props2) $$invalidate(3, setStep = $$props2.setStep);
    if ("connectionRejected" in $$props2) $$invalidate(4, connectionRejected = $$props2.connectionRejected);
    if ("previousConnectionRequest" in $$props2) $$invalidate(5, previousConnectionRequest = $$props2.previousConnectionRequest);
  };
  return [
    connectWallet,
    selectedWallet,
    deselectWallet,
    setStep,
    connectionRejected,
    previousConnectionRequest,
    $appMetadata$,
    $_,
    appMetadata$,
    click_handler
  ];
}
class ConnectingWallet extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(
      this,
      options2,
      instance$9,
      create_fragment$9,
      safe_not_equal,
      {
        connectWallet: 0,
        selectedWallet: 1,
        deselectWallet: 2,
        setStep: 3,
        connectionRejected: 4,
        previousConnectionRequest: 5
      },
      add_css$9
    );
  }
}
function add_css$8(target) {
  append_styles(target, "svelte-1uy2ffh", ".outer-container.svelte-1uy2ffh{padding:var(--onboard-spacing-4, var(--spacing-4))}.link.svelte-1uy2ffh{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:16px;color:var(--onboard-primary-500, var(--primary-500));text-decoration:none}");
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i].name;
  child_ctx[4] = list[i].url;
  child_ctx[6] = i;
  return child_ctx;
}
function create_else_block$2(ctx) {
  let t_value = (
    /*$_*/
    ctx[1]("connect.selectingWallet.installWallet", {
      default: en.connect.selectingWallet.installWallet,
      values: {
        app: (
          /*$appMetadata$*/
          ctx[0].name || "this app"
        )
      }
    }) + ""
  );
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*$_, $appMetadata$*/
      3 && t_value !== (t_value = /*$_*/
      ctx2[1]("connect.selectingWallet.installWallet", {
        default: en.connect.selectingWallet.installWallet,
        values: {
          app: (
            /*$appMetadata$*/
            ctx2[0].name || "this app"
          )
        }
      }) + "")) set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) detach(t);
    }
  };
}
function create_if_block$6(ctx) {
  let t0_value = (
    /*$_*/
    ctx[1]("connect.selectingWallet.recommendedWalletsPart1", {
      default: en.connect.selectingWallet.recommendedWalletsPart1,
      values: {
        app: (
          /*$appMetadata$*/
          ctx[0].name || "This app"
        )
      }
    }) + ""
  );
  let t0;
  let t1;
  let t2;
  let t3_value = (
    /*$_*/
    ctx[1]("connect.selectingWallet.recommendedWalletsPart2", {
      default: en.connect.selectingWallet.recommendedWalletsPart2
    }) + ""
  );
  let t3;
  let each_value = (
    /*$appMetadata$*/
    ctx[0].recommendedInjectedWallets
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  return {
    c() {
      t0 = text(t0_value);
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space();
      t3 = text(t3_value);
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, t1, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, t2, anchor);
      insert(target, t3, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*$_, $appMetadata$*/
      3 && t0_value !== (t0_value = /*$_*/
      ctx2[1]("connect.selectingWallet.recommendedWalletsPart1", {
        default: en.connect.selectingWallet.recommendedWalletsPart1,
        values: {
          app: (
            /*$appMetadata$*/
            ctx2[0].name || "This app"
          )
        }
      }) + "")) set_data(t0, t0_value);
      if (dirty & /*$appMetadata$*/
      1) {
        each_value = /*$appMetadata$*/
        ctx2[0].recommendedInjectedWallets;
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(t2.parentNode, t2);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & /*$_*/
      2 && t3_value !== (t3_value = /*$_*/
      ctx2[1]("connect.selectingWallet.recommendedWalletsPart2", {
        default: en.connect.selectingWallet.recommendedWalletsPart2
      }) + "")) set_data(t3, t3_value);
    },
    d(detaching) {
      if (detaching) detach(t0);
      if (detaching) detach(t1);
      destroy_each(each_blocks, detaching);
      if (detaching) detach(t2);
      if (detaching) detach(t3);
    }
  };
}
function create_each_block$1(ctx) {
  let a;
  let t0_value = (
    /*name*/
    ctx[3] + ""
  );
  let t0;
  let t1_value = (
    /*i*/
    ctx[6] < /*$appMetadata$*/
    ctx[0].recommendedInjectedWallets.length - 1 ? ", " : ""
  );
  let t1;
  let a_href_value;
  return {
    c() {
      a = element("a");
      t0 = text(t0_value);
      t1 = text(t1_value);
      attr(a, "class", "link pointer svelte-1uy2ffh");
      attr(a, "href", a_href_value = /*url*/
      ctx[4]);
      attr(a, "target", "_blank");
      attr(a, "rel", "noreferrer noopener");
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t0);
      append(a, t1);
    },
    p(ctx2, dirty) {
      if (dirty & /*$appMetadata$*/
      1 && t0_value !== (t0_value = /*name*/
      ctx2[3] + "")) set_data(t0, t0_value);
      if (dirty & /*$appMetadata$*/
      1 && t1_value !== (t1_value = /*i*/
      ctx2[6] < /*$appMetadata$*/
      ctx2[0].recommendedInjectedWallets.length - 1 ? ", " : "")) set_data(t1, t1_value);
      if (dirty & /*$appMetadata$*/
      1 && a_href_value !== (a_href_value = /*url*/
      ctx2[4])) {
        attr(a, "href", a_href_value);
      }
    },
    d(detaching) {
      if (detaching) detach(a);
    }
  };
}
function create_default_slot$4(ctx) {
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (
      /*$appMetadata$*/
      ctx2[0].recommendedInjectedWallets
    ) return create_if_block$6;
    return create_else_block$2;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_fragment$8(ctx) {
  let div;
  let warning;
  let current2;
  warning = new Warning({
    props: {
      $$slots: { default: [create_default_slot$4] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(warning.$$.fragment);
      attr(div, "class", "outer-container svelte-1uy2ffh");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(warning, div, null);
      current2 = true;
    },
    p(ctx2, [dirty]) {
      const warning_changes = {};
      if (dirty & /*$$scope, $_, $appMetadata$*/
      131) {
        warning_changes.$$scope = { dirty, ctx: ctx2 };
      }
      warning.$set(warning_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(warning.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(warning.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(warning);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let $appMetadata$;
  let $_;
  component_subscribe($$self, $format, ($$value) => $$invalidate(1, $_ = $$value));
  const appMetadata$ = state.select("appMetadata").pipe(startWith$1(state.get().appMetadata), shareReplay$1(1));
  component_subscribe($$self, appMetadata$, (value) => $$invalidate(0, $appMetadata$ = value));
  return [$appMetadata$, $_, appMetadata$];
}
class InstallWallet extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$8, create_fragment$8, safe_not_equal, {}, add_css$8);
  }
}
function add_css$7(target) {
  append_styles(target, "svelte-1ct6vh0", "button.svelte-1ct6vh0:disabled{opacity:0.5}button.wallet-button-styling.svelte-1ct6vh0{position:relative;align-items:flex-start;flex:1;padding:0;background:none;color:var(--onboard-wallet-button-color, inherit)}.wallet-button-container.svelte-1ct6vh0{display:flex}.wallet-button-container-inner.svelte-1ct6vh0{position:relative;display:flex;flex-flow:column;align-items:center;gap:0.5rem;padding:0.75rem;width:5rem}.name.svelte-1ct6vh0{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:1rem;text-overflow:ellipsis;max-width:5rem;max-height:2rem;overflow:hidden}.status-icon.svelte-1ct6vh0{position:absolute;top:3.5rem;left:3.5rem}@media screen and (min-width: 768px){button.wallet-button-styling.svelte-1ct6vh0{transition:background-color 250ms ease-in-out;background:var(--onboard-wallet-button-background, none);border:1px solid transparent;border-color:var(--onboard-wallet-button-border-color, var(--border-color));border-radius:var(--onboard-wallet-button-border-radius, var(--border-radius-1))}button.wallet-button-styling.svelte-1ct6vh0:hover{background:var(--onboard-wallet-button-background-hover, var(--foreground-color));color:var(--onboard-wallet-button-color-hover)}.wallet-button-container-inner.svelte-1ct6vh0{flex:1;flex-flow:row nowrap;gap:1rem;padding:1rem}button.connected.svelte-1ct6vh0{border-color:var(--onboard-success-500, var(--success-500))}.name.svelte-1ct6vh0{font-size:var(--onboard-font-size-5, var(--font-size-5));line-height:1.25rem;text-align:initial;max-width:inherit;max-height:3rem}.status-icon.svelte-1ct6vh0{top:0;bottom:0;left:auto;right:1rem;margin:auto;height:20px}}");
}
function create_if_block$5(ctx) {
  let div;
  let successstatusicon;
  let current2;
  successstatusicon = new SuccessStatusIcon({ props: { size: 20 } });
  return {
    c() {
      div = element("div");
      create_component(successstatusicon.$$.fragment);
      attr(div, "class", "status-icon svelte-1ct6vh0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(successstatusicon, div, null);
      current2 = true;
    },
    i(local) {
      if (current2) return;
      transition_in(successstatusicon.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(successstatusicon.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(successstatusicon);
    }
  };
}
function create_fragment$7(ctx) {
  let div2;
  let button;
  let div1;
  let walletappbadge;
  let t0;
  let div0;
  let t1;
  let t2;
  let button_intro;
  let current2;
  let mounted;
  let dispose;
  add_render_callback(
    /*onwindowresize*/
    ctx[7]
  );
  walletappbadge = new WalletAppBadge({
    props: {
      size: (
        /*windowWidth*/
        ctx[6] >= MOBILE_WINDOW_WIDTH ? 48 : 56
      ),
      icon: (
        /*icon*/
        ctx[0]
      ),
      loading: (
        /*connecting*/
        ctx[4]
      ),
      border: (
        /*connected*/
        ctx[3] ? "green" : "custom"
      ),
      background: "transparent"
    }
  });
  let if_block = (
    /*connected*/
    ctx[3] && create_if_block$5()
  );
  return {
    c() {
      div2 = element("div");
      button = element("button");
      div1 = element("div");
      create_component(walletappbadge.$$.fragment);
      t0 = space();
      div0 = element("div");
      t1 = text(
        /*label*/
        ctx[1]
      );
      t2 = space();
      if (if_block) if_block.c();
      attr(div0, "class", "name svelte-1ct6vh0");
      attr(div1, "class", "wallet-button-container-inner svelte-1ct6vh0");
      attr(button, "class", "wallet-button-styling svelte-1ct6vh0");
      button.disabled = /*disabled*/
      ctx[5];
      toggle_class(
        button,
        "connected",
        /*connected*/
        ctx[3]
      );
      attr(div2, "class", "wallet-button-container svelte-1ct6vh0");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, button);
      append(button, div1);
      mount_component(walletappbadge, div1, null);
      append(div1, t0);
      append(div1, div0);
      append(div0, t1);
      append(div1, t2);
      if (if_block) if_block.m(div1, null);
      current2 = true;
      if (!mounted) {
        dispose = [
          listen(
            window,
            "resize",
            /*onwindowresize*/
            ctx[7]
          ),
          listen(button, "click", function() {
            if (is_function(
              /*onClick*/
              ctx[2]
            )) ctx[2].apply(this, arguments);
          })
        ];
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      const walletappbadge_changes = {};
      if (dirty & /*windowWidth*/
      64) walletappbadge_changes.size = /*windowWidth*/
      ctx[6] >= MOBILE_WINDOW_WIDTH ? 48 : 56;
      if (dirty & /*icon*/
      1) walletappbadge_changes.icon = /*icon*/
      ctx[0];
      if (dirty & /*connecting*/
      16) walletappbadge_changes.loading = /*connecting*/
      ctx[4];
      if (dirty & /*connected*/
      8) walletappbadge_changes.border = /*connected*/
      ctx[3] ? "green" : "custom";
      walletappbadge.$set(walletappbadge_changes);
      if (!current2 || dirty & /*label*/
      2) set_data(
        t1,
        /*label*/
        ctx[1]
      );
      if (
        /*connected*/
        ctx[3]
      ) {
        if (if_block) {
          if (dirty & /*connected*/
          8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$5();
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div1, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (!current2 || dirty & /*disabled*/
      32) {
        button.disabled = /*disabled*/
        ctx[5];
      }
      if (!current2 || dirty & /*connected*/
      8) {
        toggle_class(
          button,
          "connected",
          /*connected*/
          ctx[3]
        );
      }
    },
    i(local) {
      if (current2) return;
      transition_in(walletappbadge.$$.fragment, local);
      transition_in(if_block);
      if (local) {
        if (!button_intro) {
          add_render_callback(() => {
            button_intro = create_in_transition(button, fade, {});
            button_intro.start();
          });
        }
      }
      current2 = true;
    },
    o(local) {
      transition_out(walletappbadge.$$.fragment, local);
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div2);
      destroy_component(walletappbadge);
      if (if_block) if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let { icon } = $$props;
  let { label } = $$props;
  let { onClick } = $$props;
  let { connected } = $$props;
  let { connecting } = $$props;
  let { disabled } = $$props;
  let windowWidth;
  function onwindowresize() {
    $$invalidate(6, windowWidth = window.innerWidth);
  }
  $$self.$$set = ($$props2) => {
    if ("icon" in $$props2) $$invalidate(0, icon = $$props2.icon);
    if ("label" in $$props2) $$invalidate(1, label = $$props2.label);
    if ("onClick" in $$props2) $$invalidate(2, onClick = $$props2.onClick);
    if ("connected" in $$props2) $$invalidate(3, connected = $$props2.connected);
    if ("connecting" in $$props2) $$invalidate(4, connecting = $$props2.connecting);
    if ("disabled" in $$props2) $$invalidate(5, disabled = $$props2.disabled);
  };
  return [
    icon,
    label,
    onClick,
    connected,
    connecting,
    disabled,
    windowWidth,
    onwindowresize
  ];
}
class WalletButton extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(
      this,
      options2,
      instance$7,
      create_fragment$7,
      safe_not_equal,
      {
        icon: 0,
        label: 1,
        onClick: 2,
        connected: 3,
        connecting: 4,
        disabled: 5
      },
      add_css$7
    );
  }
}
function add_css$6(target) {
  append_styles(target, "svelte-kpc6js", ".wallets-container.svelte-kpc6js{display:flex;gap:0.5rem;overflow-x:scroll;overflow-y:hidden;padding:0.75rem 0.5rem;border-bottom:1px solid var(--border-color);-ms-overflow-style:none;scrollbar-width:none}.wallets-container.svelte-kpc6js::-webkit-scrollbar{display:none}.warning-container.svelte-kpc6js{margin:1rem 1rem 0}.notice-container.svelte-kpc6js{flex:0 0 100%;margin-top:0.75rem}@media all and (min-width: 768px){.wallets-container.svelte-kpc6js{display:grid;grid-template-columns:repeat(var(--onboard-wallet-columns, 2), 1fr);padding:1rem;border:none}.notice-container.svelte-kpc6js{grid-column:span 2;margin:0}}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[10] = list[i];
  return child_ctx;
}
function create_if_block_1$3(ctx) {
  let div;
  let warning;
  let current2;
  warning = new Warning({
    props: {
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(warning.$$.fragment);
      attr(div, "class", "warning-container svelte-kpc6js");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(warning, div, null);
      current2 = true;
    },
    p(ctx2, dirty) {
      const warning_changes = {};
      if (dirty & /*$$scope, connectingErrorMessage*/
      8200) {
        warning_changes.$$scope = { dirty, ctx: ctx2 };
      }
      warning.$set(warning_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(warning.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(warning.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(warning);
    }
  };
}
function create_default_slot_1(ctx) {
  let html_tag;
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(
        /*connectingErrorMessage*/
        ctx[3],
        target,
        anchor
      );
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*connectingErrorMessage*/
      8) html_tag.p(
        /*connectingErrorMessage*/
        ctx2[3]
      );
    },
    d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }
  };
}
function create_each_block(ctx) {
  let walletbutton;
  let current2;
  function func() {
    return (
      /*func*/
      ctx[9](
        /*wallet*/
        ctx[10]
      )
    );
  }
  walletbutton = new WalletButton({
    props: {
      connected: (
        /*checkConnected*/
        ctx[7](
          /*wallet*/
          ctx[10].label
        )
      ),
      connecting: (
        /*connectingWalletLabel*/
        ctx[2] === /*wallet*/
        ctx[10].label
      ),
      label: (
        /*wallet*/
        ctx[10].label
      ),
      icon: (
        /*wallet*/
        ctx[10].icon
      ),
      onClick: func,
      disabled: (
        /*windowWidth*/
        ctx[4] <= MOBILE_WINDOW_WIDTH && /*connectingWalletLabel*/
        ctx[2] && /*connectingWalletLabel*/
        ctx[2] !== /*wallet*/
        ctx[10].label
      )
    }
  });
  return {
    c() {
      create_component(walletbutton.$$.fragment);
    },
    m(target, anchor) {
      mount_component(walletbutton, target, anchor);
      current2 = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const walletbutton_changes = {};
      if (dirty & /*wallets*/
      1) walletbutton_changes.connected = /*checkConnected*/
      ctx[7](
        /*wallet*/
        ctx[10].label
      );
      if (dirty & /*connectingWalletLabel, wallets*/
      5) walletbutton_changes.connecting = /*connectingWalletLabel*/
      ctx[2] === /*wallet*/
      ctx[10].label;
      if (dirty & /*wallets*/
      1) walletbutton_changes.label = /*wallet*/
      ctx[10].label;
      if (dirty & /*wallets*/
      1) walletbutton_changes.icon = /*wallet*/
      ctx[10].icon;
      if (dirty & /*selectWallet, wallets*/
      3) walletbutton_changes.onClick = func;
      if (dirty & /*windowWidth, connectingWalletLabel, wallets*/
      21) walletbutton_changes.disabled = /*windowWidth*/
      ctx[4] <= MOBILE_WINDOW_WIDTH && /*connectingWalletLabel*/
      ctx[2] && /*connectingWalletLabel*/
      ctx[2] !== /*wallet*/
      ctx[10].label;
      walletbutton.$set(walletbutton_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(walletbutton.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(walletbutton.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(walletbutton, detaching);
    }
  };
}
function create_if_block$4(ctx) {
  let div;
  let warning;
  let current2;
  warning = new Warning({
    props: {
      $$slots: { default: [create_default_slot$3] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(warning.$$.fragment);
      attr(div, "class", "notice-container svelte-kpc6js");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(warning, div, null);
      current2 = true;
    },
    p(ctx2, dirty) {
      const warning_changes = {};
      if (dirty & /*$$scope, $_*/
      8224) {
        warning_changes.$$scope = { dirty, ctx: ctx2 };
      }
      warning.$set(warning_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(warning.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(warning.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(warning);
    }
  };
}
function create_default_slot$3(ctx) {
  let div;
  let t0_value = (
    /*$_*/
    ctx[5]("connect.selectingWallet.whyDontISeeMyWallet", {
      default: en.connect.selectingWallet.whyDontISeeMyWallet
    }) + ""
  );
  let t0;
  let t1;
  let a;
  let t2_value = (
    /*$_*/
    ctx[5]("connect.selectingWallet.learnMore", {
      default: en.connect.selectingWallet.learnMore
    }) + ""
  );
  let t2;
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      a = element("a");
      t2 = text(t2_value);
      attr(a, "class", "link pointer");
      attr(
        a,
        "href",
        /*connect*/
        ctx[6].wheresMyWalletLink || wheresMyWalletDefault
      );
      attr(a, "target", "_blank");
      attr(a, "rel", "noreferrer noopener");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      insert(target, t1, anchor);
      insert(target, a, anchor);
      append(a, t2);
    },
    p(ctx2, dirty) {
      if (dirty & /*$_*/
      32 && t0_value !== (t0_value = /*$_*/
      ctx2[5]("connect.selectingWallet.whyDontISeeMyWallet", {
        default: en.connect.selectingWallet.whyDontISeeMyWallet
      }) + "")) set_data(t0, t0_value);
      if (dirty & /*$_*/
      32 && t2_value !== (t2_value = /*$_*/
      ctx2[5]("connect.selectingWallet.learnMore", {
        default: en.connect.selectingWallet.learnMore
      }) + "")) set_data(t2, t2_value);
    },
    d(detaching) {
      if (detaching) detach(div);
      if (detaching) detach(t1);
      if (detaching) detach(a);
    }
  };
}
function create_fragment$6(ctx) {
  let div1;
  let t0;
  let div0;
  let t1;
  let current2;
  let mounted;
  let dispose;
  add_render_callback(
    /*onwindowresize*/
    ctx[8]
  );
  let if_block0 = (
    /*connectingErrorMessage*/
    ctx[3] && create_if_block_1$3(ctx)
  );
  let each_value = (
    /*wallets*/
    ctx[0]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  let if_block1 = !/*connect*/
  ctx[6].removeWhereIsMyWalletWarning && create_if_block$4(ctx);
  return {
    c() {
      div1 = element("div");
      if (if_block0) if_block0.c();
      t0 = space();
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t1 = space();
      if (if_block1) if_block1.c();
      attr(div0, "class", "wallets-container svelte-kpc6js");
      attr(div1, "class", "outer-container");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      if (if_block0) if_block0.m(div1, null);
      append(div1, t0);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
      append(div0, t1);
      if (if_block1) if_block1.m(div0, null);
      current2 = true;
      if (!mounted) {
        dispose = listen(
          window,
          "resize",
          /*onwindowresize*/
          ctx[8]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (
        /*connectingErrorMessage*/
        ctx2[3]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*connectingErrorMessage*/
          8) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$3(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div1, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (dirty & /*checkConnected, wallets, connectingWalletLabel, selectWallet, windowWidth, MOBILE_WINDOW_WIDTH*/
      151) {
        each_value = /*wallets*/
        ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div0, t1);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (!/*connect*/
      ctx2[6].removeWhereIsMyWalletWarning) if_block1.p(ctx2, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(if_block0);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(if_block1);
      current2 = true;
    },
    o(local) {
      transition_out(if_block0);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(if_block1);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div1);
      if (if_block0) if_block0.d();
      destroy_each(each_blocks, detaching);
      if (if_block1) if_block1.d();
      mounted = false;
      dispose();
    }
  };
}
const wheresMyWalletDefault = "https://www.blocknative.com/blog/metamask-wont-connect-web3-wallet-troubleshooting";
function instance$6($$self, $$props, $$invalidate) {
  let $_;
  component_subscribe($$self, $format, ($$value) => $$invalidate(5, $_ = $$value));
  let { wallets: wallets2 } = $$props;
  let { selectWallet } = $$props;
  let { connectingWalletLabel } = $$props;
  let { connectingErrorMessage } = $$props;
  let windowWidth;
  const { connect: connect2 } = state.get();
  function checkConnected(label) {
    const { wallets: wallets3 } = state.get();
    return !!wallets3.find((wallet2) => wallet2.label === label);
  }
  function onwindowresize() {
    $$invalidate(4, windowWidth = window.innerWidth);
  }
  const func = (wallet2) => selectWallet(wallet2);
  $$self.$$set = ($$props2) => {
    if ("wallets" in $$props2) $$invalidate(0, wallets2 = $$props2.wallets);
    if ("selectWallet" in $$props2) $$invalidate(1, selectWallet = $$props2.selectWallet);
    if ("connectingWalletLabel" in $$props2) $$invalidate(2, connectingWalletLabel = $$props2.connectingWalletLabel);
    if ("connectingErrorMessage" in $$props2) $$invalidate(3, connectingErrorMessage = $$props2.connectingErrorMessage);
  };
  return [
    wallets2,
    selectWallet,
    connectingWalletLabel,
    connectingErrorMessage,
    windowWidth,
    $_,
    connect2,
    checkConnected,
    onwindowresize,
    func
  ];
}
class SelectingWallet extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(
      this,
      options2,
      instance$6,
      create_fragment$6,
      safe_not_equal,
      {
        wallets: 0,
        selectWallet: 1,
        connectingWalletLabel: 2,
        connectingErrorMessage: 3
      },
      add_css$6
    );
  }
}
function add_css$5(target) {
  append_styles(target, "svelte-obaru3", ".sidebar.svelte-obaru3{--background-color:var(\n      --onboard-connect-sidebar-background,\n      var(--w3o-foreground-color, none)\n    );--text-color:var(--onboard-connect-sidebar-color, inherit);--border-color:var(--onboard-connect-sidebar-border-color, inherit);display:flex;flex-flow:column;gap:1rem;padding:1rem;align-items:center}.inner-container.svelte-obaru3{display:flex;flex-flow:column;align-items:center;align-self:stretch;gap:0.5rem;padding:1.5rem;text-align:center;border:1px solid transparent;border-radius:12px;border-color:var(--border-color);background:var(--background-color);color:var(--text-color)}.icon-container.svelte-obaru3{display:flex;height:3.5rem;width:auto;min-width:3.5rem;max-width:100%}.heading.svelte-obaru3{font-size:var(--onboard-font-size-3, var(--font-size-3));margin:0 0 var(--onboard-spacing-5, var(--spacing-5)) 0}.subheading.svelte-obaru3{line-height:1rem}.description.svelte-obaru3{line-height:1.25rem;font-size:var(--onboard-font-size-6, var(--font-size-6))}img.svelte-obaru3{max-width:100%;height:auto}.indicators.svelte-obaru3{margin-top:auto}.indicator.svelte-obaru3{box-sizing:content-box;width:8px;height:8px;border-radius:8px;background:var(\n      --onboard-connect-sidebar-progress-background,\n      var(--onboard-gray-700, var(--gray-700))\n    );transition:background 250ms ease-in-out}.indicator.on.svelte-obaru3{background:var(\n      --onboard-connect-sidebar-progress-color,\n      var(--action-color)\n    );border:2px solid\n      var(\n        --onboard-connect-sidebar-progress-background,\n        var(--onboard-gray-700, var(--gray-700))\n      )}.join.svelte-obaru3{box-sizing:content-box;z-index:1;right:4px;height:2px;background:var(\n      --onboard-connect-sidebar-progress-background,\n      var(--onboard-gray-700, var(--gray-700))\n    );transition:background 250ms ease-in-out}.join.active.svelte-obaru3{background:var(\n      --onboard-connect-sidebar-progress-color,\n      var(--action-color)\n    )}.no-link.svelte-obaru3{display:flex;flex-direction:row;align-items:center;padding:0.25rem 0.5rem 0.25rem 0.75rem;gap:0.25rem;font-size:var(--onboard-font-size-6, var(--font-size-6))}.info-icon.svelte-obaru3{width:1.25rem;display:flex;align-items:center}@media all and (min-width: 768px){.sidebar.svelte-obaru3{max-width:280px;border-right:1px solid;border-color:var(--border-color);background:var(--background-color)}.inner-container.svelte-obaru3{border:none;text-align:initial;flex:1;align-items:flex-start;gap:1rem}.indicators.svelte-obaru3{margin-bottom:0.25rem}}");
}
function create_if_block_3$2(ctx) {
  let div;
  let t;
  let show_if = (
    /*$_*/
    ctx[3](`connect.${/*step*/
    ctx[0]}.sidebar.header`, { default: "" })
  );
  let if_block1_anchor;
  function select_block_type(ctx2, dirty) {
    if (
      /*$appMetadata$*/
      ctx2[2] && /*$appMetadata$*/
      (ctx2[2].logo || /*$appMetadata$*/
      ctx2[2].icon)
    ) return create_if_block_5$2;
    return create_else_block_1$1;
  }
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type(ctx);
  let if_block1 = show_if && create_if_block_4$2(ctx);
  return {
    c() {
      div = element("div");
      if_block0.c();
      t = space();
      if (if_block1) if_block1.c();
      if_block1_anchor = empty();
      attr(div, "class", "icon-container svelte-obaru3");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_block0.m(div, null);
      insert(target, t, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block0) {
        if_block0.p(ctx2, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div, null);
        }
      }
      if (dirty & /*$_, step*/
      9) show_if = /*$_*/
      ctx2[3](`connect.${/*step*/
      ctx2[0]}.sidebar.header`, { default: "" });
      if (show_if) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_4$2(ctx2);
          if_block1.c();
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    d(detaching) {
      if (detaching) detach(div);
      if_block0.d();
      if (detaching) detach(t);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(if_block1_anchor);
    }
  };
}
function create_else_block_1$1(ctx) {
  let html_tag;
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(defaultBnIcon, target, anchor);
      insert(target, html_anchor, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }
  };
}
function create_if_block_5$2(ctx) {
  let show_if;
  let if_block_anchor;
  function select_block_type_1(ctx2, dirty) {
    if (dirty & /*$appMetadata$*/
    4) show_if = null;
    if (show_if == null) show_if = !!isSVG(
      /*$appMetadata$*/
      ctx2[2].logo || /*$appMetadata$*/
      ctx2[2].icon
    );
    if (show_if) return create_if_block_6$2;
    return create_else_block$1;
  }
  let current_block_type = select_block_type_1(ctx, -1);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx2, dirty)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_else_block$1(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (!src_url_equal(img.src, img_src_value = /*$appMetadata$*/
      ctx[2].logo || /*$appMetadata$*/
      ctx[2].icon)) attr(img, "src", img_src_value);
      attr(img, "alt", "logo");
      attr(img, "class", "svelte-obaru3");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*$appMetadata$*/
      4 && !src_url_equal(img.src, img_src_value = /*$appMetadata$*/
      ctx2[2].logo || /*$appMetadata$*/
      ctx2[2].icon)) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching) detach(img);
    }
  };
}
function create_if_block_6$2(ctx) {
  let html_tag;
  let raw_value = (
    /*$appMetadata$*/
    (ctx[2].logo || /*$appMetadata$*/
    ctx[2].icon) + ""
  );
  let t;
  return {
    c() {
      html_tag = new HtmlTag(false);
      t = text("​");
      html_tag.a = t;
    },
    m(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*$appMetadata$*/
      4 && raw_value !== (raw_value = /*$appMetadata$*/
      (ctx2[2].logo || /*$appMetadata$*/
      ctx2[2].icon) + "")) html_tag.p(raw_value);
    },
    d(detaching) {
      if (detaching) html_tag.d();
      if (detaching) detach(t);
    }
  };
}
function create_if_block_4$2(ctx) {
  let div;
  let t_value = (
    /*$_*/
    ctx[3](`connect.${/*step*/
    ctx[0]}.sidebar.header`, { default: (
      /*heading*/
      ctx[7]
    ) }) + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "heading svelte-obaru3");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*$_, step*/
      9 && t_value !== (t_value = /*$_*/
      ctx2[3](`connect.${/*step*/
      ctx2[0]}.sidebar.header`, { default: (
        /*heading*/
        ctx2[7]
      ) }) + "")) set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}
function create_if_block_2$2(ctx) {
  let a;
  let t0_value = (
    /*$_*/
    ctx[3]("connect.selectingWallet.sidebar.IDontHaveAWallet", {
      default: en.connect.selectingWallet.sidebar.IDontHaveAWallet
    }) + ""
  );
  let t0;
  let t1;
  let div;
  return {
    c() {
      a = element("a");
      t0 = text(t0_value);
      t1 = space();
      div = element("div");
      attr(div, "class", "info-icon svelte-obaru3");
      attr(
        a,
        "href",
        /*connect*/
        ctx[4].iDontHaveAWalletLink || "https://ethereum.org/en/wallets/find-wallet/#main-content"
      );
      attr(a, "target", "_blank");
      attr(a, "rel", "noreferrer noopener");
      attr(a, "class", "no-link svelte-obaru3");
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t0);
      append(a, t1);
      append(a, div);
      div.innerHTML = infoIcon;
    },
    p(ctx2, dirty) {
      if (dirty & /*$_*/
      8 && t0_value !== (t0_value = /*$_*/
      ctx2[3]("connect.selectingWallet.sidebar.IDontHaveAWallet", {
        default: en.connect.selectingWallet.sidebar.IDontHaveAWallet
      }) + "")) set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching) detach(a);
    }
  };
}
function create_if_block_1$2(ctx) {
  let div5;
  let div0;
  let t0;
  let div1;
  let div1_style_value;
  let t1;
  let div2;
  let t2;
  let div3;
  let div3_style_value;
  let t3;
  let div4;
  return {
    c() {
      div5 = element("div");
      div0 = element("div");
      t0 = space();
      div1 = element("div");
      t1 = space();
      div2 = element("div");
      t2 = space();
      div3 = element("div");
      t3 = space();
      div4 = element("div");
      attr(div0, "class", "indicator relative svelte-obaru3");
      toggle_class(div0, "on", true);
      attr(div1, "class", "join relative svelte-obaru3");
      attr(div1, "style", div1_style_value = `${/*step*/
      ctx[0] !== "selectingWallet" ? "right: 4px; width: 52px;" : "right: 2px; width: 54px;"}`);
      toggle_class(
        div1,
        "active",
        /*step*/
        ctx[0] !== "selectingWallet"
      );
      attr(div2, "class", "indicator relative svelte-obaru3");
      attr(div2, "style", `right: 8px;`);
      toggle_class(
        div2,
        "on",
        /*step*/
        ctx[0] !== "selectingWallet"
      );
      attr(div3, "class", "join relative svelte-obaru3");
      attr(div3, "style", div3_style_value = `${/*step*/
      ctx[0] === "connectedWallet" ? "right: 12px; width: 52px;" : "right: 10px; width: 54px;"}`);
      toggle_class(
        div3,
        "active",
        /*step*/
        ctx[0] === "connectedWallet"
      );
      attr(div4, "style", `right: 16px;`);
      attr(div4, "class", "indicator relative svelte-obaru3");
      toggle_class(
        div4,
        "on",
        /*step*/
        ctx[0] === "connectedWallet"
      );
      attr(div5, "class", "indicators flex items-center svelte-obaru3");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, div0);
      append(div5, t0);
      append(div5, div1);
      append(div5, t1);
      append(div5, div2);
      append(div5, t2);
      append(div5, div3);
      append(div5, t3);
      append(div5, div4);
    },
    p(ctx2, dirty) {
      if (dirty & /*step*/
      1 && div1_style_value !== (div1_style_value = `${/*step*/
      ctx2[0] !== "selectingWallet" ? "right: 4px; width: 52px;" : "right: 2px; width: 54px;"}`)) {
        attr(div1, "style", div1_style_value);
      }
      if (dirty & /*step*/
      1) {
        toggle_class(
          div1,
          "active",
          /*step*/
          ctx2[0] !== "selectingWallet"
        );
      }
      if (dirty & /*step*/
      1) {
        toggle_class(
          div2,
          "on",
          /*step*/
          ctx2[0] !== "selectingWallet"
        );
      }
      if (dirty & /*step*/
      1 && div3_style_value !== (div3_style_value = `${/*step*/
      ctx2[0] === "connectedWallet" ? "right: 12px; width: 52px;" : "right: 10px; width: 54px;"}`)) {
        attr(div3, "style", div3_style_value);
      }
      if (dirty & /*step*/
      1) {
        toggle_class(
          div3,
          "active",
          /*step*/
          ctx2[0] === "connectedWallet"
        );
      }
      if (dirty & /*step*/
      1) {
        toggle_class(
          div4,
          "on",
          /*step*/
          ctx2[0] === "connectedWallet"
        );
      }
    },
    d(detaching) {
      if (detaching) detach(div5);
    }
  };
}
function create_if_block$3(ctx) {
  let div5;
  let div0;
  let t0;
  let div1;
  let div1_style_value;
  let t1;
  let div2;
  let t2;
  let div3;
  let div3_style_value;
  let t3;
  let div4;
  return {
    c() {
      div5 = element("div");
      div0 = element("div");
      t0 = space();
      div1 = element("div");
      t1 = space();
      div2 = element("div");
      t2 = space();
      div3 = element("div");
      t3 = space();
      div4 = element("div");
      attr(div0, "class", "indicator relative svelte-obaru3");
      toggle_class(div0, "on", true);
      attr(div1, "class", "join relative svelte-obaru3");
      attr(div1, "style", div1_style_value = `right: 2px; ${/*step*/
      ctx[0] !== "selectingWallet" ? "width: 78px;" : "width: 82px;"}`);
      toggle_class(
        div1,
        "active",
        /*step*/
        ctx[0] !== "selectingWallet"
      );
      attr(div2, "class", "indicator relative svelte-obaru3");
      attr(div2, "style", `right: 4px;`);
      toggle_class(
        div2,
        "on",
        /*step*/
        ctx[0] !== "selectingWallet"
      );
      attr(div3, "class", "join relative svelte-obaru3");
      attr(div3, "style", div3_style_value = `right: 6px; ${/*step*/
      ctx[0] === "connectedWallet" ? "width: 74px;" : "width: 81px;"}`);
      toggle_class(
        div3,
        "active",
        /*step*/
        ctx[0] === "connectedWallet"
      );
      attr(div4, "style", `right: 8px;`);
      attr(div4, "class", "indicator relative svelte-obaru3");
      toggle_class(
        div4,
        "on",
        /*step*/
        ctx[0] === "connectedWallet"
      );
      attr(div5, "class", "indicators flex items-center svelte-obaru3");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, div0);
      append(div5, t0);
      append(div5, div1);
      append(div5, t1);
      append(div5, div2);
      append(div5, t2);
      append(div5, div3);
      append(div5, t3);
      append(div5, div4);
    },
    p(ctx2, dirty) {
      if (dirty & /*step*/
      1 && div1_style_value !== (div1_style_value = `right: 2px; ${/*step*/
      ctx2[0] !== "selectingWallet" ? "width: 78px;" : "width: 82px;"}`)) {
        attr(div1, "style", div1_style_value);
      }
      if (dirty & /*step*/
      1) {
        toggle_class(
          div1,
          "active",
          /*step*/
          ctx2[0] !== "selectingWallet"
        );
      }
      if (dirty & /*step*/
      1) {
        toggle_class(
          div2,
          "on",
          /*step*/
          ctx2[0] !== "selectingWallet"
        );
      }
      if (dirty & /*step*/
      1 && div3_style_value !== (div3_style_value = `right: 6px; ${/*step*/
      ctx2[0] === "connectedWallet" ? "width: 74px;" : "width: 81px;"}`)) {
        attr(div3, "style", div3_style_value);
      }
      if (dirty & /*step*/
      1) {
        toggle_class(
          div3,
          "active",
          /*step*/
          ctx2[0] === "connectedWallet"
        );
      }
      if (dirty & /*step*/
      1) {
        toggle_class(
          div4,
          "on",
          /*step*/
          ctx2[0] === "connectedWallet"
        );
      }
    },
    d(detaching) {
      if (detaching) detach(div5);
    }
  };
}
function create_fragment$5(ctx) {
  let div4;
  let div2;
  let t0;
  let div0;
  let t1_value = (
    /*$_*/
    ctx[3](`connect.${/*step*/
    ctx[0]}.sidebar.subheading`, { default: (
      /*subheading*/
      ctx[5]
    ) }) + ""
  );
  let t1;
  let t2;
  let div1;
  let t3_value = (
    /*$_*/
    ctx[3](`connect.${/*step*/
    ctx[0]}.sidebar.paragraph`, {
      values: {
        app: (
          /*$appMetadata$*/
          ctx[2] && /*$appMetadata$*/
          ctx[2].name || "This App"
        )
      },
      default: (
        /*paragraph*/
        ctx[6]
      )
    }) + ""
  );
  let t3;
  let t4;
  let t5;
  let t6;
  let t7;
  let div3;
  let mounted;
  let dispose;
  add_render_callback(
    /*onwindowresize*/
    ctx[9]
  );
  let if_block0 = (
    /*windowWidth*/
    ctx[1] >= MOBILE_WINDOW_WIDTH && create_if_block_3$2(ctx)
  );
  let if_block1 = !/*connect*/
  ctx[4].removeIDontHaveAWalletInfoLink && create_if_block_2$2(ctx);
  let if_block2 = (
    /*windowWidth*/
    ctx[1] < MOBILE_WINDOW_WIDTH && create_if_block_1$2(ctx)
  );
  let if_block3 = (
    /*windowWidth*/
    ctx[1] >= MOBILE_WINDOW_WIDTH && create_if_block$3(ctx)
  );
  return {
    c() {
      div4 = element("div");
      div2 = element("div");
      if (if_block0) if_block0.c();
      t0 = space();
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      div1 = element("div");
      t3 = text(t3_value);
      t4 = space();
      if (if_block1) if_block1.c();
      t5 = space();
      if (if_block2) if_block2.c();
      t6 = space();
      if (if_block3) if_block3.c();
      t7 = space();
      div3 = element("div");
      attr(div0, "class", "subheading svelte-obaru3");
      attr(div1, "class", "description svelte-obaru3");
      attr(div2, "class", "inner-container svelte-obaru3");
      attr(div4, "class", "sidebar svelte-obaru3");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div2);
      if (if_block0) if_block0.m(div2, null);
      append(div2, t0);
      append(div2, div0);
      append(div0, t1);
      append(div2, t2);
      append(div2, div1);
      append(div1, t3);
      append(div2, t4);
      if (if_block1) if_block1.m(div2, null);
      append(div2, t5);
      if (if_block2) if_block2.m(div2, null);
      append(div4, t6);
      if (if_block3) if_block3.m(div4, null);
      append(div4, t7);
      append(div4, div3);
      div3.innerHTML = poweredByThirdweb;
      if (!mounted) {
        dispose = listen(
          window,
          "resize",
          /*onwindowresize*/
          ctx[9]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (
        /*windowWidth*/
        ctx2[1] >= MOBILE_WINDOW_WIDTH
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_3$2(ctx2);
          if_block0.c();
          if_block0.m(div2, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty & /*$_, step*/
      9 && t1_value !== (t1_value = /*$_*/
      ctx2[3](`connect.${/*step*/
      ctx2[0]}.sidebar.subheading`, { default: (
        /*subheading*/
        ctx2[5]
      ) }) + "")) set_data(t1, t1_value);
      if (dirty & /*$_, step, $appMetadata$*/
      13 && t3_value !== (t3_value = /*$_*/
      ctx2[3](`connect.${/*step*/
      ctx2[0]}.sidebar.paragraph`, {
        values: {
          app: (
            /*$appMetadata$*/
            ctx2[2] && /*$appMetadata$*/
            ctx2[2].name || "This App"
          )
        },
        default: (
          /*paragraph*/
          ctx2[6]
        )
      }) + "")) set_data(t3, t3_value);
      if (!/*connect*/
      ctx2[4].removeIDontHaveAWalletInfoLink) if_block1.p(ctx2, dirty);
      if (
        /*windowWidth*/
        ctx2[1] < MOBILE_WINDOW_WIDTH
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_1$2(ctx2);
          if_block2.c();
          if_block2.m(div2, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (
        /*windowWidth*/
        ctx2[1] >= MOBILE_WINDOW_WIDTH
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block$3(ctx2);
          if_block3.c();
          if_block3.m(div4, t7);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div4);
      if (if_block0) if_block0.d();
      if (if_block1) if_block1.d();
      if (if_block2) if_block2.d();
      if (if_block3) if_block3.d();
      mounted = false;
      dispose();
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let $appMetadata$;
  let $_;
  component_subscribe($$self, $format, ($$value) => $$invalidate(3, $_ = $$value));
  let { step } = $$props;
  const { connect: connect2 } = state.get();
  const defaultContent = en.connect[step].sidebar;
  const { subheading, paragraph } = defaultContent;
  const { heading } = defaultContent;
  let windowWidth;
  const appMetadata$ = state.select("appMetadata").pipe(startWith$1(state.get().appMetadata), shareReplay$1(1));
  component_subscribe($$self, appMetadata$, (value) => $$invalidate(2, $appMetadata$ = value));
  function onwindowresize() {
    $$invalidate(1, windowWidth = window.innerWidth);
  }
  $$self.$$set = ($$props2) => {
    if ("step" in $$props2) $$invalidate(0, step = $$props2.step);
  };
  return [
    step,
    windowWidth,
    $appMetadata$,
    $_,
    connect2,
    subheading,
    paragraph,
    heading,
    appMetadata$,
    onwindowresize
  ];
}
class Sidebar extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$5, create_fragment$5, safe_not_equal, { step: 0 }, add_css$5);
  }
}
function add_css$4(target) {
  append_styles(target, "svelte-1qwmck3", ".container.svelte-1qwmck3{--background-color:var(\n      --onboard-main-scroll-container-background,\n      var(--w3o-background-color)\n    );--foreground-color:var(--w3o-foreground-color);--text-color:var(--onboard-connect-text-color, var(--w3o-text-color));--border-color:var(--w3o-border-color, var(--gray-200));--action-color:var(--w3o-action-color, var(--primary-500));font-family:var(--onboard-font-family-normal, var(--font-family-normal));font-size:var(--onboard-font-size-5, 1rem);background:var(--background-color);color:var(--text-color);border-color:var(--border-color);line-height:24px;overflow:hidden;position:relative;display:flex;height:min-content;flex-flow:column-reverse}.content.svelte-1qwmck3{width:var(--onboard-connect-content-width, 100%)}.header.svelte-1qwmck3{display:flex;padding:1rem;border-bottom:1px solid transparent;background:var(--onboard-connect-header-background);color:var(--onboard-connect-header-color);border-color:var(--border-color)}.header-heading.svelte-1qwmck3{line-height:1rem}.button-container.svelte-1qwmck3{right:0.5rem;top:0.5rem}.mobile-header.svelte-1qwmck3{display:flex;gap:0.5rem;height:4.5rem;padding:1rem;border-bottom:1px solid;border-color:var(--border-color)}.mobile-subheader.svelte-1qwmck3{opacity:0.6;font-size:0.875rem;font-weight:400;line-height:1rem;margin-top:0.25rem}.icon-container.svelte-1qwmck3{display:flex;flex:0 0 auto;height:2.5rem;width:2.5rem;min-width:2.5rem;justify-content:center;align-items:center}.disabled.svelte-1qwmck3{opacity:0.2;pointer-events:none;overflow:hidden}.icon-container svg{display:block;height:100%;width:auto}.w-full.svelte-1qwmck3{width:100%}.scroll-container.svelte-1qwmck3{overflow-y:auto;transition:opacity 250ms ease-in-out;scrollbar-width:none}.scroll-container.svelte-1qwmck3::-webkit-scrollbar{display:none}@media all and (min-width: 768px){.container.svelte-1qwmck3{margin:0;flex-flow:row;height:var(--onboard-connect-content-height, 440px)}.content.svelte-1qwmck3{width:var(--onboard-connect-content-width, 488px)}.mobile-subheader.svelte-1qwmck3{display:none}.icon-container.svelte-1qwmck3{display:none}}");
}
function create_if_block$2(ctx) {
  let modal;
  let current2;
  modal = new Modal({
    props: {
      close: !/*connect*/
      ctx[16].disableClose && /*close*/
      ctx[20],
      $$slots: { default: [create_default_slot$2] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const modal_changes = {};
      if (dirty[0] & /*scrollContainer, selectedWallet, $modalStep$, windowWidth, connectionRejected, previousConnectionRequest, displayConnectingWallet, agreed, wallets, connectingWalletLabel, connectingErrorMessage, availableWallets, $_, $appMetadata$*/
      32766 | dirty[1] & /*$$scope*/
      32) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(modal.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function create_if_block_9$1(ctx) {
  let sidebar;
  let current2;
  sidebar = new Sidebar({ props: { step: (
    /*$modalStep$*/
    ctx[5]
  ) } });
  return {
    c() {
      create_component(sidebar.$$.fragment);
    },
    m(target, anchor) {
      mount_component(sidebar, target, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const sidebar_changes = {};
      if (dirty[0] & /*$modalStep$*/
      32) sidebar_changes.step = /*$modalStep$*/
      ctx2[5];
      sidebar.$set(sidebar_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(sidebar.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(sidebar.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(sidebar, detaching);
    }
  };
}
function create_else_block_3(ctx) {
  let div1;
  let div0;
  let t0_value = (
    /*$_*/
    ctx[14](`connect.${/*$modalStep$*/
    ctx[5]}.header`, {
      default: en.connect[
        /*$modalStep$*/
        ctx[5]
      ].header,
      values: {
        connectionRejected: (
          /*connectionRejected*/
          ctx[1]
        ),
        wallet: (
          /*selectedWallet*/
          ctx[3] && /*selectedWallet*/
          ctx[3].label
        )
      }
    }) + ""
  );
  let t0;
  let t1;
  let t2_value = (
    /*$modalStep$*/
    ctx[5] === "selectingWallet" ? `(${/*availableWallets*/
    ctx[12]})` : ""
  );
  let t2;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      t2 = text(t2_value);
      attr(div0, "class", "header-heading svelte-1qwmck3");
      attr(div1, "class", "header relative flex items-center svelte-1qwmck3");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, t0);
      append(div0, t1);
      append(div0, t2);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$_, $modalStep$, connectionRejected, selectedWallet*/
      16426 && t0_value !== (t0_value = /*$_*/
      ctx2[14](`connect.${/*$modalStep$*/
      ctx2[5]}.header`, {
        default: en.connect[
          /*$modalStep$*/
          ctx2[5]
        ].header,
        values: {
          connectionRejected: (
            /*connectionRejected*/
            ctx2[1]
          ),
          wallet: (
            /*selectedWallet*/
            ctx2[3] && /*selectedWallet*/
            ctx2[3].label
          )
        }
      }) + "")) set_data(t0, t0_value);
      if (dirty[0] & /*$modalStep$, availableWallets*/
      4128 && t2_value !== (t2_value = /*$modalStep$*/
      ctx2[5] === "selectingWallet" ? `(${/*availableWallets*/
      ctx2[12]})` : "")) set_data(t2, t2_value);
    },
    d(detaching) {
      if (detaching) detach(div1);
    }
  };
}
function create_if_block_6$1(ctx) {
  let div4;
  let div0;
  let t0;
  let div3;
  let div1;
  let t1_value = (
    /*$_*/
    ctx[14](
      /*$modalStep$*/
      ctx[5] === "connectingWallet" && /*selectedWallet*/
      ctx[3] ? `connect.${/*$modalStep$*/
      ctx[5]}.header` : `connect.${/*$modalStep$*/
      ctx[5]}.sidebar.subheading`,
      {
        default: (
          /*$modalStep$*/
          ctx[5] === "connectingWallet" && /*selectedWallet*/
          ctx[3] ? en.connect[
            /*$modalStep$*/
            ctx[5]
          ].header : en.connect[
            /*$modalStep$*/
            ctx[5]
          ].sidebar.subheading
        ),
        values: {
          connectionRejected: (
            /*connectionRejected*/
            ctx[1]
          ),
          wallet: (
            /*selectedWallet*/
            ctx[3] && /*selectedWallet*/
            ctx[3].label
          )
        }
      }
    ) + ""
  );
  let t1;
  let t2;
  let div2;
  let t3_value = (
    /*$modalStep$*/
    ctx[5] === "selectingWallet" ? (
      /*availableWallets*/
      ctx[12] > 1 ? `${/*availableWallets*/
      ctx[12]} ${/*$_*/
      ctx[14]("connect.selectingWallet.header").toLowerCase()}` : `1 ${/*$_*/
      ctx[14]("connect.connectedWallet.availableWallet").toLowerCase()}`
    ) : `1 ${/*$_*/
    ctx[14]("connect.connectedWallet.accountSelected").toLowerCase()}`
  );
  let t3;
  function select_block_type_1(ctx2, dirty) {
    if (
      /*$appMetadata$*/
      ctx2[13] && /*$appMetadata$*/
      ctx2[13].icon
    ) return create_if_block_7$1;
    return create_else_block_2;
  }
  let current_block_type = select_block_type_1(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      div4 = element("div");
      div0 = element("div");
      if_block.c();
      t0 = space();
      div3 = element("div");
      div1 = element("div");
      t1 = text(t1_value);
      t2 = space();
      div2 = element("div");
      t3 = text(t3_value);
      attr(div0, "class", "icon-container svelte-1qwmck3");
      attr(div1, "class", "header-heading svelte-1qwmck3");
      attr(div2, "class", "mobile-subheader svelte-1qwmck3");
      attr(div3, "class", "flex flex-column justify-center w-full svelte-1qwmck3");
      attr(div4, "class", "mobile-header svelte-1qwmck3");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div0);
      if_block.m(div0, null);
      append(div4, t0);
      append(div4, div3);
      append(div3, div1);
      append(div1, t1);
      append(div3, t2);
      append(div3, div2);
      append(div2, t3);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(div0, null);
        }
      }
      if (dirty[0] & /*$_, $modalStep$, selectedWallet, connectionRejected*/
      16426 && t1_value !== (t1_value = /*$_*/
      ctx2[14](
        /*$modalStep$*/
        ctx2[5] === "connectingWallet" && /*selectedWallet*/
        ctx2[3] ? `connect.${/*$modalStep$*/
        ctx2[5]}.header` : `connect.${/*$modalStep$*/
        ctx2[5]}.sidebar.subheading`,
        {
          default: (
            /*$modalStep$*/
            ctx2[5] === "connectingWallet" && /*selectedWallet*/
            ctx2[3] ? en.connect[
              /*$modalStep$*/
              ctx2[5]
            ].header : en.connect[
              /*$modalStep$*/
              ctx2[5]
            ].sidebar.subheading
          ),
          values: {
            connectionRejected: (
              /*connectionRejected*/
              ctx2[1]
            ),
            wallet: (
              /*selectedWallet*/
              ctx2[3] && /*selectedWallet*/
              ctx2[3].label
            )
          }
        }
      ) + "")) set_data(t1, t1_value);
      if (dirty[0] & /*$modalStep$, availableWallets, $_*/
      20512 && t3_value !== (t3_value = /*$modalStep$*/
      ctx2[5] === "selectingWallet" ? (
        /*availableWallets*/
        ctx2[12] > 1 ? `${/*availableWallets*/
        ctx2[12]} ${/*$_*/
        ctx2[14]("connect.selectingWallet.header").toLowerCase()}` : `1 ${/*$_*/
        ctx2[14]("connect.connectedWallet.availableWallet").toLowerCase()}`
      ) : `1 ${/*$_*/
      ctx2[14]("connect.connectedWallet.accountSelected").toLowerCase()}`)) set_data(t3, t3_value);
    },
    d(detaching) {
      if (detaching) detach(div4);
      if_block.d();
    }
  };
}
function create_else_block_2(ctx) {
  let html_tag;
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(defaultBnIcon, target, anchor);
      insert(target, html_anchor, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }
  };
}
function create_if_block_7$1(ctx) {
  let show_if;
  let if_block_anchor;
  function select_block_type_2(ctx2, dirty) {
    if (dirty[0] & /*$appMetadata$*/
    8192) show_if = null;
    if (show_if == null) show_if = !!isSVG(
      /*$appMetadata$*/
      ctx2[13].icon
    );
    if (show_if) return create_if_block_8$1;
    return create_else_block_1;
  }
  let current_block_type = select_block_type_2(ctx, [-1, -1]);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_2(ctx2, dirty)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_else_block_1(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (!src_url_equal(img.src, img_src_value = /*$appMetadata$*/
      ctx[13].icon)) attr(img, "src", img_src_value);
      attr(img, "alt", "logo");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$appMetadata$*/
      8192 && !src_url_equal(img.src, img_src_value = /*$appMetadata$*/
      ctx2[13].icon)) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching) detach(img);
    }
  };
}
function create_if_block_8$1(ctx) {
  let html_tag;
  let raw_value = (
    /*$appMetadata$*/
    ctx[13].icon + ""
  );
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$appMetadata$*/
      8192 && raw_value !== (raw_value = /*$appMetadata$*/
      ctx2[13].icon + "")) html_tag.p(raw_value);
    },
    d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }
  };
}
function create_if_block_5$1(ctx) {
  let div;
  let closebutton;
  let current2;
  let mounted;
  let dispose;
  closebutton = new CloseButton({});
  return {
    c() {
      div = element("div");
      create_component(closebutton.$$.fragment);
      attr(div, "class", "button-container absolute svelte-1qwmck3");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(closebutton, div, null);
      current2 = true;
      if (!mounted) {
        dispose = listen(
          div,
          "click",
          /*close*/
          ctx[20]
        );
        mounted = true;
      }
    },
    p: noop,
    i(local) {
      if (current2) return;
      transition_in(closebutton.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(closebutton.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(closebutton);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_3$1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current2;
  const if_block_creators = [create_if_block_4$1, create_else_block];
  const if_blocks = [];
  function select_block_type_3(ctx2, dirty) {
    if (
      /*wallets*/
      ctx2[2].length
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type_3(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_3(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_else_block(ctx) {
  let installwallet;
  let current2;
  installwallet = new InstallWallet({});
  return {
    c() {
      create_component(installwallet.$$.fragment);
    },
    m(target, anchor) {
      mount_component(installwallet, target, anchor);
      current2 = true;
    },
    p: noop,
    i(local) {
      if (current2) return;
      transition_in(installwallet.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(installwallet.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(installwallet, detaching);
    }
  };
}
function create_if_block_4$1(ctx) {
  let agreement2;
  let updating_agreed;
  let t;
  let div;
  let selectingwallet;
  let current2;
  function agreement_agreed_binding(value) {
    ctx[24](value);
  }
  let agreement_props = {};
  if (
    /*agreed*/
    ctx[7] !== void 0
  ) {
    agreement_props.agreed = /*agreed*/
    ctx[7];
  }
  agreement2 = new Agreement({ props: agreement_props });
  binding_callbacks.push(() => bind(agreement2, "agreed", agreement_agreed_binding));
  selectingwallet = new SelectingWallet({
    props: {
      selectWallet: (
        /*selectWallet*/
        ctx[18]
      ),
      wallets: (
        /*wallets*/
        ctx[2]
      ),
      connectingWalletLabel: (
        /*connectingWalletLabel*/
        ctx[8]
      ),
      connectingErrorMessage: (
        /*connectingErrorMessage*/
        ctx[9]
      )
    }
  });
  return {
    c() {
      create_component(agreement2.$$.fragment);
      t = space();
      div = element("div");
      create_component(selectingwallet.$$.fragment);
      attr(div, "class", "svelte-1qwmck3");
      toggle_class(div, "disabled", !/*agreed*/
      ctx[7]);
    },
    m(target, anchor) {
      mount_component(agreement2, target, anchor);
      insert(target, t, anchor);
      insert(target, div, anchor);
      mount_component(selectingwallet, div, null);
      current2 = true;
    },
    p(ctx2, dirty) {
      const agreement_changes = {};
      if (!updating_agreed && dirty[0] & /*agreed*/
      128) {
        updating_agreed = true;
        agreement_changes.agreed = /*agreed*/
        ctx2[7];
        add_flush_callback(() => updating_agreed = false);
      }
      agreement2.$set(agreement_changes);
      const selectingwallet_changes = {};
      if (dirty[0] & /*wallets*/
      4) selectingwallet_changes.wallets = /*wallets*/
      ctx2[2];
      if (dirty[0] & /*connectingWalletLabel*/
      256) selectingwallet_changes.connectingWalletLabel = /*connectingWalletLabel*/
      ctx2[8];
      if (dirty[0] & /*connectingErrorMessage*/
      512) selectingwallet_changes.connectingErrorMessage = /*connectingErrorMessage*/
      ctx2[9];
      selectingwallet.$set(selectingwallet_changes);
      if (!current2 || dirty[0] & /*agreed*/
      128) {
        toggle_class(div, "disabled", !/*agreed*/
        ctx2[7]);
      }
    },
    i(local) {
      if (current2) return;
      transition_in(agreement2.$$.fragment, local);
      transition_in(selectingwallet.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(agreement2.$$.fragment, local);
      transition_out(selectingwallet.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(agreement2, detaching);
      if (detaching) detach(t);
      if (detaching) detach(div);
      destroy_component(selectingwallet);
    }
  };
}
function create_if_block_2$1(ctx) {
  let connectingwallet;
  let current2;
  connectingwallet = new ConnectingWallet({
    props: {
      connectWallet: (
        /*connectWallet*/
        ctx[21]
      ),
      connectionRejected: (
        /*connectionRejected*/
        ctx[1]
      ),
      previousConnectionRequest: (
        /*previousConnectionRequest*/
        ctx[6]
      ),
      setStep: (
        /*setStep*/
        ctx[22]
      ),
      deselectWallet: (
        /*deselectWallet*/
        ctx[19]
      ),
      selectedWallet: (
        /*selectedWallet*/
        ctx[3]
      )
    }
  });
  return {
    c() {
      create_component(connectingwallet.$$.fragment);
    },
    m(target, anchor) {
      mount_component(connectingwallet, target, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const connectingwallet_changes = {};
      if (dirty[0] & /*connectionRejected*/
      2) connectingwallet_changes.connectionRejected = /*connectionRejected*/
      ctx2[1];
      if (dirty[0] & /*previousConnectionRequest*/
      64) connectingwallet_changes.previousConnectionRequest = /*previousConnectionRequest*/
      ctx2[6];
      if (dirty[0] & /*selectedWallet*/
      8) connectingwallet_changes.selectedWallet = /*selectedWallet*/
      ctx2[3];
      connectingwallet.$set(connectingwallet_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(connectingwallet.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(connectingwallet.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(connectingwallet, detaching);
    }
  };
}
function create_if_block_1$1(ctx) {
  let connectedwallet;
  let current2;
  connectedwallet = new ConnectedWallet({
    props: {
      selectedWallet: (
        /*selectedWallet*/
        ctx[3]
      )
    }
  });
  return {
    c() {
      create_component(connectedwallet.$$.fragment);
    },
    m(target, anchor) {
      mount_component(connectedwallet, target, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const connectedwallet_changes = {};
      if (dirty[0] & /*selectedWallet*/
      8) connectedwallet_changes.selectedWallet = /*selectedWallet*/
      ctx2[3];
      connectedwallet.$set(connectedwallet_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(connectedwallet.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(connectedwallet.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(connectedwallet, detaching);
    }
  };
}
function create_default_slot$2(ctx) {
  let div2;
  let t0;
  let div1;
  let t1;
  let t2;
  let div0;
  let t3;
  let t4;
  let current2;
  let if_block0 = (
    /*connect*/
    ctx[16].showSidebar && create_if_block_9$1(ctx)
  );
  function select_block_type(ctx2, dirty) {
    if (
      /*windowWidth*/
      ctx2[4] <= MOBILE_WINDOW_WIDTH
    ) return create_if_block_6$1;
    return create_else_block_3;
  }
  let current_block_type = select_block_type(ctx);
  let if_block1 = current_block_type(ctx);
  let if_block2 = !/*connect*/
  ctx[16].disableClose && create_if_block_5$1(ctx);
  let if_block3 = (
    /*$modalStep$*/
    (ctx[5] === "selectingWallet" || /*windowWidth*/
    ctx[4] <= MOBILE_WINDOW_WIDTH) && create_if_block_3$1(ctx)
  );
  let if_block4 = (
    /*displayConnectingWallet*/
    ctx[11] && create_if_block_2$1(ctx)
  );
  let if_block5 = (
    /*$modalStep$*/
    ctx[5] === "connectedWallet" && /*selectedWallet*/
    ctx[3] && /*windowWidth*/
    ctx[4] >= MOBILE_WINDOW_WIDTH && create_if_block_1$1(ctx)
  );
  return {
    c() {
      div2 = element("div");
      if (if_block0) if_block0.c();
      t0 = space();
      div1 = element("div");
      if_block1.c();
      t1 = space();
      if (if_block2) if_block2.c();
      t2 = space();
      div0 = element("div");
      if (if_block3) if_block3.c();
      t3 = space();
      if (if_block4) if_block4.c();
      t4 = space();
      if (if_block5) if_block5.c();
      attr(div0, "class", "scroll-container svelte-1qwmck3");
      attr(div1, "class", "content flex flex-column svelte-1qwmck3");
      attr(div2, "class", "container svelte-1qwmck3");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (if_block0) if_block0.m(div2, null);
      append(div2, t0);
      append(div2, div1);
      if_block1.m(div1, null);
      append(div1, t1);
      if (if_block2) if_block2.m(div1, null);
      append(div1, t2);
      append(div1, div0);
      if (if_block3) if_block3.m(div0, null);
      append(div0, t3);
      if (if_block4) if_block4.m(div0, null);
      append(div0, t4);
      if (if_block5) if_block5.m(div0, null);
      ctx[25](div0);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (
        /*connect*/
        ctx2[16].showSidebar
      ) if_block0.p(ctx2, dirty);
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block1) {
        if_block1.p(ctx2, dirty);
      } else {
        if_block1.d(1);
        if_block1 = current_block_type(ctx2);
        if (if_block1) {
          if_block1.c();
          if_block1.m(div1, t1);
        }
      }
      if (!/*connect*/
      ctx2[16].disableClose) if_block2.p(ctx2, dirty);
      if (
        /*$modalStep$*/
        ctx2[5] === "selectingWallet" || /*windowWidth*/
        ctx2[4] <= MOBILE_WINDOW_WIDTH
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
          if (dirty[0] & /*$modalStep$, windowWidth*/
          48) {
            transition_in(if_block3, 1);
          }
        } else {
          if_block3 = create_if_block_3$1(ctx2);
          if_block3.c();
          transition_in(if_block3, 1);
          if_block3.m(div0, t3);
        }
      } else if (if_block3) {
        group_outros();
        transition_out(if_block3, 1, 1, () => {
          if_block3 = null;
        });
        check_outros();
      }
      if (
        /*displayConnectingWallet*/
        ctx2[11]
      ) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
          if (dirty[0] & /*displayConnectingWallet*/
          2048) {
            transition_in(if_block4, 1);
          }
        } else {
          if_block4 = create_if_block_2$1(ctx2);
          if_block4.c();
          transition_in(if_block4, 1);
          if_block4.m(div0, t4);
        }
      } else if (if_block4) {
        group_outros();
        transition_out(if_block4, 1, 1, () => {
          if_block4 = null;
        });
        check_outros();
      }
      if (
        /*$modalStep$*/
        ctx2[5] === "connectedWallet" && /*selectedWallet*/
        ctx2[3] && /*windowWidth*/
        ctx2[4] >= MOBILE_WINDOW_WIDTH
      ) {
        if (if_block5) {
          if_block5.p(ctx2, dirty);
          if (dirty[0] & /*$modalStep$, selectedWallet, windowWidth*/
          56) {
            transition_in(if_block5, 1);
          }
        } else {
          if_block5 = create_if_block_1$1(ctx2);
          if_block5.c();
          transition_in(if_block5, 1);
          if_block5.m(div0, null);
        }
      } else if (if_block5) {
        group_outros();
        transition_out(if_block5, 1, 1, () => {
          if_block5 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current2) return;
      transition_in(if_block0);
      transition_in(if_block2);
      transition_in(if_block3);
      transition_in(if_block4);
      transition_in(if_block5);
      current2 = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block2);
      transition_out(if_block3);
      transition_out(if_block4);
      transition_out(if_block5);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div2);
      if (if_block0) if_block0.d();
      if_block1.d();
      if (if_block2) if_block2.d();
      if (if_block3) if_block3.d();
      if (if_block4) if_block4.d();
      if (if_block5) if_block5.d();
      ctx[25](null);
    }
  };
}
function create_fragment$4(ctx) {
  let if_block_anchor;
  let current2;
  let mounted;
  let dispose;
  add_render_callback(
    /*onwindowresize*/
    ctx[23]
  );
  let if_block = !/*autoSelect*/
  ctx[0].disableModals && create_if_block$2(ctx);
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current2 = true;
      if (!mounted) {
        dispose = listen(
          window,
          "resize",
          /*onwindowresize*/
          ctx[23]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (!/*autoSelect*/
      ctx2[0].disableModals) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*autoSelect*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
      mounted = false;
      dispose();
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let availableWallets;
  let displayConnectingWallet;
  let $appMetadata$;
  let $modalStep$;
  let $_;
  component_subscribe($$self, $format, ($$value) => $$invalidate(14, $_ = $$value));
  let { autoSelect } = $$props;
  const appMetadata$ = state.select("appMetadata").pipe(startWith$1(state.get().appMetadata), shareReplay$1(1));
  component_subscribe($$self, appMetadata$, (value) => $$invalidate(13, $appMetadata$ = value));
  const { walletModules, connect: connect2, chains: chains2 } = state.get();
  const cancelPreviousConnect$ = new Subject();
  const { unstoppableResolution, wagmi } = configuration;
  let connectionRejected = false;
  let previousConnectionRequest = false;
  let wallets2 = [];
  let selectedWallet;
  let agreed;
  let connectingWalletLabel;
  let connectingErrorMessage;
  let windowWidth;
  let scrollContainer;
  const modalStep$ = new BehaviorSubject("selectingWallet");
  component_subscribe($$self, modalStep$, (value) => $$invalidate(5, $modalStep$ = value));
  connectWallet$.pipe(distinctUntilChanged((prev, curr) => prev.autoSelect && curr.autoSelect && prev.autoSelect.disableModals === curr.autoSelect.disableModals), filter$1(({ autoSelect: autoSelect2 }) => autoSelect2 && autoSelect2.disableModals === false), takeUntil$1(onDestroy$)).subscribe(() => {
    selectedWallet && connectWallet();
  });
  async function selectWallet({ label, icon, getInterface }) {
    $$invalidate(8, connectingWalletLabel = label);
    try {
      const existingWallet = state.get().wallets.find((wallet2) => wallet2.label === label);
      if (existingWallet) {
        addWallet(existingWallet);
        setTimeout(() => setStep("connectedWallet"), 1);
        $$invalidate(3, selectedWallet = existingWallet);
        return;
      }
      const { chains: chains3 } = state.get();
      const { provider, instance: instance2 } = await getInterface({
        chains: chains3,
        EventEmitter,
        appMetadata: $appMetadata$
      });
      const loadedIcon = await icon;
      $$invalidate(3, selectedWallet = {
        label,
        icon: loadedIcon,
        provider,
        instance: instance2,
        accounts: [],
        chains: [{ namespace: "evm", id: "0x1" }]
      });
      $$invalidate(9, connectingErrorMessage = "");
      scrollToTop();
      setTimeout(() => setStep("connectingWallet"), 1);
    } catch (error) {
      const { message } = error;
      $$invalidate(9, connectingErrorMessage = message);
      $$invalidate(8, connectingWalletLabel = "");
      scrollToTop();
    }
  }
  function deselectWallet() {
    $$invalidate(3, selectedWallet = null);
  }
  function updateSelectedWallet(update2) {
    $$invalidate(3, selectedWallet = Object.assign(Object.assign({}, selectedWallet), update2));
  }
  async function autoSelectWallet(wallet2) {
    const { getIcon, getInterface, label } = wallet2;
    const icon = getIcon();
    selectWallet({ label, icon, getInterface });
  }
  async function loadWalletsForSelection() {
    $$invalidate(2, wallets2 = walletModules.map(({ getIcon, getInterface, label }) => {
      return { label, icon: getIcon(), getInterface };
    }));
  }
  function close() {
    connectWallet$.next({ inProgress: false });
  }
  async function connectWallet() {
    $$invalidate(1, connectionRejected = false);
    const { provider, label } = selectedWallet;
    cancelPreviousConnect$.next();
    try {
      let address;
      let wagmiConnector;
      if (wagmi) {
        const { buildWagmiConfig, wagmiConnect, getWagmiConnector } = wagmi;
        const wagmiConfig = await buildWagmiConfig(chains2, { label, provider });
        updateWagmiConfig(wagmiConfig);
        wagmiConnector = getWagmiConnector(label);
        const accountsReq = await Promise.race([
          wagmiConnect(wagmiConfig, { connector: wagmiConnector }),
          // or connect wallet is called again whilst waiting for response
          firstValueFrom(cancelPreviousConnect$.pipe(mapTo([])))
        ]);
        if (!accountsReq || !("accounts" in accountsReq)) {
          return;
        }
        const [connectedAddress] = accountsReq.accounts;
        address = connectedAddress;
      } else {
        const [connectedAddress] = await Promise.race([
          // resolved account
          requestAccounts(provider),
          // or connect wallet is called again whilst waiting for response
          firstValueFrom(cancelPreviousConnect$.pipe(mapTo([])))
        ]);
        if (!connectedAddress) {
          return;
        }
        address = connectedAddress;
      }
      if (state.get().connect.autoConnectLastWallet || state.get().connect.autoConnectAllPreviousWallet) {
        let labelsList = getLocalStore(STORAGE_KEYS.LAST_CONNECTED_WALLET);
        try {
          let labelsListParsed = JSON.parse(labelsList);
          if (labelsListParsed && Array.isArray(labelsListParsed)) {
            const tempLabels = labelsListParsed;
            labelsList = [.../* @__PURE__ */ new Set([label, ...tempLabels])];
          }
        } catch (err) {
          if (err instanceof SyntaxError && labelsList && typeof labelsList === "string") {
            const tempLabel = labelsList;
            labelsList = [tempLabel];
          } else {
            throw new Error(err);
          }
        }
        if (!labelsList) labelsList = [label];
        setLocalStore(STORAGE_KEYS.LAST_CONNECTED_WALLET, JSON.stringify(labelsList));
      }
      const chain = await getChainId(provider);
      const update2 = {
        accounts: [
          {
            address,
            ens: null,
            uns: null,
            balance: null
          }
        ],
        chains: [{ namespace: "evm", id: chain }],
        wagmiConnector
      };
      addWallet(Object.assign(Object.assign({}, selectedWallet), update2));
      trackWallet(provider, label);
      updateSelectedWallet(update2);
      setStep("connectedWallet");
      scrollToTop();
    } catch (error) {
      const { code } = error;
      scrollToTop();
      if (code === ProviderRpcErrorCode.ACCOUNT_ACCESS_REJECTED) {
        $$invalidate(1, connectionRejected = true);
        if (autoSelect.disableModals) {
          connectWallet$.next({ inProgress: false });
        } else if (autoSelect.label) {
          $$invalidate(0, autoSelect.label = "", autoSelect);
        }
        return;
      }
      if (code === ProviderRpcErrorCode.ACCOUNT_ACCESS_ALREADY_REQUESTED) {
        $$invalidate(6, previousConnectionRequest = true);
        if (autoSelect.disableModals) {
          connectWallet$.next({ inProgress: false });
          return;
        }
        listenAccountsChanged({
          provider: selectedWallet.provider,
          disconnected$: connectWallet$.pipe(filter$1(({ inProgress }) => !inProgress), mapTo(""))
        }).pipe(take$1(1)).subscribe(([account2]) => {
          account2 && connectWallet();
        });
        return;
      }
    }
  }
  async function updateAccountDetails() {
    const { accounts: accounts2, chains: selectedWalletChains } = selectedWallet;
    const appChains = state.get().chains;
    const [connectedWalletChain] = selectedWalletChains;
    const appChain = appChains.find(({ namespace, id }) => namespace === connectedWalletChain.namespace && id === connectedWalletChain.id);
    const { address } = accounts2[0];
    let { balance: balance2, ens: ens2, uns: uns2, secondaryTokens: secondaryTokens2 } = accounts2[0];
    if (balance2 === null) {
      getBalance(address, appChain).then((balance3) => {
        updateAccount(selectedWallet.label, address, { balance: balance3 });
      });
    }
    if (appChain && !secondaryTokens2 && Array.isArray(appChain.secondaryTokens) && appChain.secondaryTokens.length) {
      updateSecondaryTokens(address, appChain).then((secondaryTokens3) => {
        updateAccount(selectedWallet.label, address, { secondaryTokens: secondaryTokens3 });
      });
    }
    if (ens2 === null && validEnsChain(connectedWalletChain.id)) {
      const ensChain = chains2.find(({ id }) => id === validEnsChain(connectedWalletChain.id));
      getEns(address, ensChain).then((ens3) => {
        updateAccount(selectedWallet.label, address, { ens: ens3 });
      });
    }
    if (uns2 === null && unstoppableResolution) {
      getUns(address, appChain).then((uns3) => {
        updateAccount(selectedWallet.label, address, { uns: uns3 });
      });
    }
    setTimeout(() => connectWallet$.next({ inProgress: false }), 1500);
  }
  modalStep$.pipe(takeUntil$1(onDestroy$)).subscribe((step) => {
    switch (step) {
      case "selectingWallet": {
        if (autoSelect.label) {
          const walletToAutoSelect = walletModules.find(({ label }) => label.toLowerCase() === autoSelect.label.toLowerCase());
          if (walletToAutoSelect) {
            autoSelectWallet(walletToAutoSelect);
          } else if (autoSelect.disableModals) {
            connectWallet$.next({ inProgress: false });
          }
        } else {
          $$invalidate(8, connectingWalletLabel = "");
          loadWalletsForSelection();
        }
        break;
      }
      case "connectingWallet": {
        connectWallet();
        break;
      }
      case "connectedWallet": {
        $$invalidate(8, connectingWalletLabel = "");
        updateAccountDetails();
        break;
      }
    }
  });
  function setStep(update2) {
    cancelPreviousConnect$.next();
    modalStep$.next(update2);
  }
  function scrollToTop() {
    scrollContainer && scrollContainer.scrollTo(0, 0);
  }
  function onwindowresize() {
    $$invalidate(4, windowWidth = window.innerWidth);
  }
  function agreement_agreed_binding(value) {
    agreed = value;
    $$invalidate(7, agreed);
  }
  function div0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      scrollContainer = $$value;
      $$invalidate(10, scrollContainer);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("autoSelect" in $$props2) $$invalidate(0, autoSelect = $$props2.autoSelect);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*wallets*/
    4) {
      $$invalidate(12, availableWallets = wallets2.length - state.get().wallets.length);
    }
    if ($$self.$$.dirty[0] & /*$modalStep$, selectedWallet, windowWidth, connectionRejected*/
    58) {
      $$invalidate(11, displayConnectingWallet = $modalStep$ === "connectingWallet" && selectedWallet && windowWidth >= MOBILE_WINDOW_WIDTH || windowWidth <= MOBILE_WINDOW_WIDTH && connectionRejected && $modalStep$ === "connectingWallet" && selectedWallet);
    }
  };
  return [
    autoSelect,
    connectionRejected,
    wallets2,
    selectedWallet,
    windowWidth,
    $modalStep$,
    previousConnectionRequest,
    agreed,
    connectingWalletLabel,
    connectingErrorMessage,
    scrollContainer,
    displayConnectingWallet,
    availableWallets,
    $appMetadata$,
    $_,
    appMetadata$,
    connect2,
    modalStep$,
    selectWallet,
    deselectWallet,
    close,
    connectWallet,
    setStep,
    onwindowresize,
    agreement_agreed_binding,
    div0_binding
  ];
}
class Index$1 extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$4, create_fragment$4, safe_not_equal, { autoSelect: 0 }, add_css$4, [-1, -1]);
  }
}
function add_css$3(target) {
  append_styles(target, "svelte-12yam41", ".container.svelte-12yam41{padding:var(--onboard-spacing-4, var(--spacing-4));font-family:var(--onboard-font-family-normal, var(--font-family-normal));line-height:16px;font-size:var(--onboard-font-size-5, var(--font-size-5))}.close.svelte-12yam41{top:var(--onboard-spacing-5, var(--spacing-5));right:var(--onboard-spacing-5, var(--spacing-5));padding:0.5rem}h4.svelte-12yam41{font-size:var(--onboard-font-size-3, var(--font-size-3));margin:var(--onboard-spacing-4, var(--spacing-4)) 0}p.svelte-12yam41{margin:0 0 var(--onboard-spacing-4, var(--spacing-4)) 0;max-width:488px}");
}
function create_default_slot$1(ctx) {
  let div1;
  let h4;
  let t0_value = (
    /*$_*/
    ctx[0]("modals.switchChain.heading", { default: en.modals.switchChain.heading }) + ""
  );
  let t0;
  let t1;
  let p0;
  let t2_value = (
    /*$_*/
    ctx[0]("modals.switchChain.paragraph1", {
      default: en.modals.switchChain.paragraph1,
      values: {
        app: (
          /*$appMetadata$*/
          ctx[1] && /*$appMetadata$*/
          ctx[1].name || "This app"
        ),
        nextNetworkName: (
          /*nextNetworkName*/
          ctx[2]
        )
      }
    }) + ""
  );
  let t2;
  let t3;
  let p1;
  let t4_value = (
    /*$_*/
    ctx[0]("modals.switchChain.paragraph2", {
      default: en.modals.switchChain.paragraph2
    }) + ""
  );
  let t4;
  let t5;
  let div0;
  let closebutton;
  let current2;
  let mounted;
  let dispose;
  closebutton = new CloseButton({});
  return {
    c() {
      div1 = element("div");
      h4 = element("h4");
      t0 = text(t0_value);
      t1 = space();
      p0 = element("p");
      t2 = text(t2_value);
      t3 = space();
      p1 = element("p");
      t4 = text(t4_value);
      t5 = space();
      div0 = element("div");
      create_component(closebutton.$$.fragment);
      attr(h4, "class", "svelte-12yam41");
      attr(p0, "class", "svelte-12yam41");
      attr(p1, "class", "svelte-12yam41");
      attr(div0, "class", "close absolute svelte-12yam41");
      attr(div1, "class", "container relative svelte-12yam41");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, h4);
      append(h4, t0);
      append(div1, t1);
      append(div1, p0);
      append(p0, t2);
      append(div1, t3);
      append(div1, p1);
      append(p1, t4);
      append(div1, t5);
      append(div1, div0);
      mount_component(closebutton, div0, null);
      current2 = true;
      if (!mounted) {
        dispose = listen(
          div0,
          "click",
          /*close*/
          ctx[3]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if ((!current2 || dirty & /*$_*/
      1) && t0_value !== (t0_value = /*$_*/
      ctx2[0]("modals.switchChain.heading", { default: en.modals.switchChain.heading }) + "")) set_data(t0, t0_value);
      if ((!current2 || dirty & /*$_, $appMetadata$*/
      3) && t2_value !== (t2_value = /*$_*/
      ctx2[0]("modals.switchChain.paragraph1", {
        default: en.modals.switchChain.paragraph1,
        values: {
          app: (
            /*$appMetadata$*/
            ctx2[1] && /*$appMetadata$*/
            ctx2[1].name || "This app"
          ),
          nextNetworkName: (
            /*nextNetworkName*/
            ctx2[2]
          )
        }
      }) + "")) set_data(t2, t2_value);
      if ((!current2 || dirty & /*$_*/
      1) && t4_value !== (t4_value = /*$_*/
      ctx2[0]("modals.switchChain.paragraph2", {
        default: en.modals.switchChain.paragraph2
      }) + "")) set_data(t4, t4_value);
    },
    i(local) {
      if (current2) return;
      transition_in(closebutton.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(closebutton.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div1);
      destroy_component(closebutton);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$3(ctx) {
  let modal;
  let current2;
  modal = new Modal({
    props: {
      close: (
        /*close*/
        ctx[3]
      ),
      $$slots: { default: [create_default_slot$1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current2 = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & /*$$scope, $_, $appMetadata$*/
      67) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(modal.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let $switchChainModal$;
  let $_;
  let $appMetadata$;
  component_subscribe($$self, switchChainModal$, ($$value) => $$invalidate(5, $switchChainModal$ = $$value));
  component_subscribe($$self, $format, ($$value) => $$invalidate(0, $_ = $$value));
  const nextNetworkName = $switchChainModal$.chain.label;
  function close() {
    switchChainModal$.next(null);
  }
  const appMetadata$ = state.select("appMetadata").pipe(startWith(state.get().appMetadata), shareReplay(1));
  component_subscribe($$self, appMetadata$, (value) => $$invalidate(1, $appMetadata$ = value));
  return [$_, $appMetadata$, nextNetworkName, close, appMetadata$];
}
class SwitchChain extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$3, create_fragment$3, safe_not_equal, {}, add_css$3);
  }
}
function add_css$2(target) {
  append_styles(target, "svelte-z54y2j", ".icon.svelte-z54y2j{border-radius:50px;color:var(--onboard-primary-500, var(--primary-500))}");
}
function create_fragment$2(ctx) {
  let div;
  let div_style_value;
  return {
    c() {
      div = element("div");
      attr(div, "class", "icon flex svelte-z54y2j");
      attr(div, "style", div_style_value = `width: ${/*size*/
      ctx[0]}px; height: ${/*size*/
      ctx[0]}px;`);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      div.innerHTML = infoIcon;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*size*/
      1 && div_style_value !== (div_style_value = `width: ${/*size*/
      ctx2[0]}px; height: ${/*size*/
      ctx2[0]}px;`)) {
        attr(div, "style", div_style_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { size = 20 } = $$props;
  $$self.$$set = ($$props2) => {
    if ("size" in $$props2) $$invalidate(0, size = $$props2.size);
  };
  return [size];
}
class InfoIcon extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$2, create_fragment$2, safe_not_equal, { size: 0 }, add_css$2);
  }
}
function add_css$1(target) {
  append_styles(target, "svelte-20hjq1", ".content.svelte-20hjq1{padding:1rem;width:300px;font-family:var(--onboard-font-family-normal, var(--font-family-normal));font-size:var(--onboard-font-size-5, var(--font-size-5));line-height:24px;background:var(\n      --onboard-action-required-modal-background,\n      var(--onboard-white, var(--white))\n    )}.icon-container.svelte-20hjq1{width:3rem;height:3rem;background:var(--onboard-primary-100, var(--primary-100));border-radius:24px}h4.svelte-20hjq1{margin:1.5rem 0 0.5rem 0;font-weight:600}.action-required-heading.svelte-20hjq1,.action-required-info.svelte-20hjq1{color:var(\n      --onboard-action-required-text-color,\n      var(--onboard-black, inherit)\n    )}.action-required-btn.svelte-20hjq1{color:var(\n      --onboard-action-required-btn-text-color,\n      var(--onboard-black, inherit)\n    )}p.svelte-20hjq1{margin:0;font-weight:400}a.svelte-20hjq1{font-weight:600}button.svelte-20hjq1{margin-top:1.5rem;font-weight:600}");
}
function create_if_block$1(ctx) {
  let a;
  let t_value = (
    /*$_*/
    ctx[1]("modals.actionRequired.linkText", { values: { wallet: (
      /*wallet*/
      ctx[0]
    ) } }) + ""
  );
  let t;
  return {
    c() {
      a = element("a");
      t = text(t_value);
      attr(a, "href", "https://metamask.zendesk.com/hc/en-us/articles/360061346311-Switching-accounts-in-MetaMask");
      attr(a, "target", "_blank");
      attr(a, "rel", "noreferrer noopener");
      attr(a, "class", "svelte-20hjq1");
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*$_, wallet*/
      3 && t_value !== (t_value = /*$_*/
      ctx2[1]("modals.actionRequired.linkText", { values: { wallet: (
        /*wallet*/
        ctx2[0]
      ) } }) + "")) set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) detach(a);
    }
  };
}
function create_default_slot(ctx) {
  let div1;
  let div0;
  let infoicon;
  let t0;
  let h4;
  let t1_value = (
    /*$_*/
    ctx[1]("modals.actionRequired.heading", { values: { wallet: (
      /*wallet*/
      ctx[0]
    ) } }) + ""
  );
  let t1;
  let t2;
  let p;
  let t3_value = (
    /*$_*/
    ctx[1]("modals.actionRequired.paragraph", { values: { wallet: (
      /*wallet*/
      ctx[0]
    ) } }) + ""
  );
  let t3;
  let t4;
  let t5;
  let button;
  let t6_value = (
    /*$_*/
    ctx[1]("modals.actionRequired.buttonText") + ""
  );
  let t6;
  let current2;
  let mounted;
  let dispose;
  infoicon = new InfoIcon({});
  let if_block = (
    /*wallet*/
    ctx[0] === "MetaMask" && create_if_block$1(ctx)
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      create_component(infoicon.$$.fragment);
      t0 = space();
      h4 = element("h4");
      t1 = text(t1_value);
      t2 = space();
      p = element("p");
      t3 = text(t3_value);
      t4 = space();
      if (if_block) if_block.c();
      t5 = space();
      button = element("button");
      t6 = text(t6_value);
      attr(div0, "class", "icon-container flex justify-center items-center svelte-20hjq1");
      attr(h4, "class", "action-required-heading svelte-20hjq1");
      attr(p, "class", "action-required-info svelte-20hjq1");
      attr(button, "class", "button-neutral-solid rounded action-required-btn svelte-20hjq1");
      attr(div1, "class", "content svelte-20hjq1");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      mount_component(infoicon, div0, null);
      append(div1, t0);
      append(div1, h4);
      append(h4, t1);
      append(div1, t2);
      append(div1, p);
      append(p, t3);
      append(p, t4);
      if (if_block) if_block.m(p, null);
      append(div1, t5);
      append(div1, button);
      append(button, t6);
      current2 = true;
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*close*/
          ctx[2]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if ((!current2 || dirty & /*$_, wallet*/
      3) && t1_value !== (t1_value = /*$_*/
      ctx2[1]("modals.actionRequired.heading", { values: { wallet: (
        /*wallet*/
        ctx2[0]
      ) } }) + "")) set_data(t1, t1_value);
      if ((!current2 || dirty & /*$_, wallet*/
      3) && t3_value !== (t3_value = /*$_*/
      ctx2[1]("modals.actionRequired.paragraph", { values: { wallet: (
        /*wallet*/
        ctx2[0]
      ) } }) + "")) set_data(t3, t3_value);
      if (
        /*wallet*/
        ctx2[0] === "MetaMask"
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$1(ctx2);
          if_block.c();
          if_block.m(p, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if ((!current2 || dirty & /*$_*/
      2) && t6_value !== (t6_value = /*$_*/
      ctx2[1]("modals.actionRequired.buttonText") + "")) set_data(t6, t6_value);
    },
    i(local) {
      if (current2) return;
      transition_in(infoicon.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(infoicon.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div1);
      destroy_component(infoicon);
      if (if_block) if_block.d();
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$1(ctx) {
  let modal;
  let current2;
  modal = new Modal({
    props: {
      close: (
        /*close*/
        ctx[2]
      ),
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current2 = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & /*$$scope, $_, wallet*/
      11) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(modal.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let $_;
  component_subscribe($$self, $format, ($$value) => $$invalidate(1, $_ = $$value));
  let { wallet: wallet2 } = $$props;
  function close() {
    connectWallet$.next({ inProgress: false, actionRequired: "" });
  }
  $$self.$$set = ($$props2) => {
    if ("wallet" in $$props2) $$invalidate(0, wallet2 = $$props2.wallet);
  };
  return [wallet2, $_, close];
}
class ActionRequired extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance$1, create_fragment$1, safe_not_equal, { wallet: 0 }, add_css$1);
  }
}
function add_css(target) {
  append_styles(target, "svelte-w5zexe", `.flex{display:flex}.inline-flex{display:inline-flex}.flex-column{flex-direction:column}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.justify-center{justify-content:center}.justify-start{justify-content:flex-start}.justify-between{justify-content:space-between}.justify-end{justify-content:flex-end}.justify-around{justify-content:space-around}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.pointer{cursor:pointer}.shadow-1{box-shadow:var(--onboard-shadow-1, var(--shadow-1))}.w-100{width:100%}*{box-sizing:border-box}input{background:var(--onboard-white, var(--white))}input{width:100%;padding:0.5rem 1rem;outline:2px solid var(--onboard-gray-200, var(--gray-200));border:none;border-radius:8px;font-size:1rem;line-height:1.5;color:var(--onboard-gray-600, var(--gray-600));transition:all 200ms ease-in-out}input[type='checkbox']{-webkit-appearance:none;appearance:none;width:auto;background:var(--onboard-white, var(--white));outline:1px solid var(--onboard-gray-300, var(--gray-300));border:none;padding:0.5em;border-radius:3px;display:flex;justify-content:center;align-items:center;position:relative;cursor:pointer}input[type='checkbox']:hover{border-color:var(
      --onboard-checkbox-background,
      var(--onboard-primary-500, var(--primary-500))
    )}input[type='checkbox']:checked{background:var(
      --onboard-checkbox-background,
      var(--onboard-primary-500, var(--primary-500))
    );border-color:var(
      --onboard-checkbox-background,
      var(--onboard-primary-500, var(--primary-500))
    );color:var(--onboard-checkbox-color, var(--onboard-white, var(--white)))}input[type='checkbox']:checked:after{content:url("data:image/svg+xml,%3Csvg width='0.885em' height='0.6em' viewBox='0 0 14 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 6L5 11L14 2L12.59 0.58L5 8.17L1.41 4.59L0 6Z' fill='white'/%3E%3C/svg%3E");font-size:12px;position:absolute;color:var(--onboard-checkbox-color, var(--onboard-white, var(--white)))}input:hover{border-color:var(
      --onboard-checkbox-color,
      var(--onboard-white, var(--white))
    )}input:focus{border-color:var(--onboard-primary-500, var(--primary-500));box-shadow:0 0 1px 1px
      var(
        --onboard-checkbox-background,
        var(--onboard-primary-500, var(--primary-500))
      );box-shadow:0 0 0 1px -moz-mac-focusring}input:disabled, textarea:disabled, select:disabled{background:var(--gray-100)}input::-moz-focus-inner{outline:0;padding:0;margin-top:-2px;margin-bottom:-2px}a{color:var(
      --onboard-link-color,
      var(--onboard-primary-500, var(--primary-500))
    );text-decoration:none}a:hover{text-decoration:underline}button{display:flex;align-items:center;justify-content:center;padding:calc(var(--onboard-spacing-4, var(--spacing-4)) - 1px);border-radius:24px;cursor:pointer;font:inherit;border:none;transition:background-color 150ms ease-in-out, color 150ms ease-in-out}.onboard-button-primary{background:var(--onboard-white, var(--white));padding:calc(var(--onboard-spacing-5, var(--spacing-5)) - 1px)
      calc(var(--onboard-spacing-4, var(--spacing-4)) - 1px);color:var(--onboard-gray-500, var(--gray-500));font-size:var(--onboard-font-size-6, var(--font-size-6));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));border:1px solid var(--onboard-gray-500, var(--gray-500));font-weight:600}.button-neutral-solid{width:100%;border-radius:8px;background:var(--onboard-gray-500, var(--gray-500));color:var(--onboard-white, var(--white));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3))}.button-neutral-solid-b{width:100%;background:var(--onboard-gray-100, var(--gray-100));color:var(--onboard-gray-500, var(--gray-500));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3))}button.rounded{border-radius:24px}.button-neutral-solid:hover{background:var(--onboard-gray-700, var(--gray-700))}.button-neutral-solid-b:hover{background:var(--onboard-gray-200, var(--gray-200))}.button-neutral-solid:active{color:var(--onboard-gray-300, var(--gray-300))}.button-neutral-solid-b:active{color:var(--onboard-gray-600, var(--gray-600));background:var(--onboard-gray-300, var(--gray-300))}.container.svelte-w5zexe{padding:16px;font-family:var(--onboard-font-family-normal, var(--font-family-normal));pointer-events:none;touch-action:none;width:100%}.z-indexed.svelte-w5zexe{z-index:var(--account-center-z-index)}@media all and (min-width: 428px){.container.svelte-w5zexe{max-width:348px}}`);
}
function create_if_block_13(ctx) {
  let connect2;
  let current2;
  connect2 = new Index$1({
    props: {
      autoSelect: (
        /*$connectWallet$*/
        ctx[8].autoSelect
      )
    }
  });
  return {
    c() {
      create_component(connect2.$$.fragment);
    },
    m(target, anchor) {
      mount_component(connect2, target, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const connect_changes = {};
      if (dirty & /*$connectWallet$*/
      256) connect_changes.autoSelect = /*$connectWallet$*/
      ctx2[8].autoSelect;
      connect2.$set(connect_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(connect2.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(connect2.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(connect2, detaching);
    }
  };
}
function create_if_block_12(ctx) {
  let actionrequired;
  let current2;
  actionrequired = new ActionRequired({
    props: {
      wallet: (
        /*$connectWallet$*/
        ctx[8].actionRequired
      )
    }
  });
  return {
    c() {
      create_component(actionrequired.$$.fragment);
    },
    m(target, anchor) {
      mount_component(actionrequired, target, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const actionrequired_changes = {};
      if (dirty & /*$connectWallet$*/
      256) actionrequired_changes.wallet = /*$connectWallet$*/
      ctx2[8].actionRequired;
      actionrequired.$set(actionrequired_changes);
    },
    i(local) {
      if (current2) return;
      transition_in(actionrequired.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(actionrequired.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(actionrequired, detaching);
    }
  };
}
function create_if_block_11(ctx) {
  let switchchain;
  let current2;
  switchchain = new SwitchChain({});
  return {
    c() {
      create_component(switchchain.$$.fragment);
    },
    m(target, anchor) {
      mount_component(switchchain, target, anchor);
      current2 = true;
    },
    i(local) {
      if (current2) return;
      transition_in(switchchain.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      transition_out(switchchain.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      destroy_component(switchchain, detaching);
    }
  };
}
function create_if_block_5(ctx) {
  let div1;
  let show_if_1 = (
    /*$notify$*/
    ctx[3].position.includes("bottom") && /*$accountCenter$*/
    ctx[1].position.includes("bottom") && /*samePositionOrMobile*/
    ctx[7]
  );
  let t0;
  let div0;
  let t1;
  let show_if = (
    /*$notify$*/
    ctx[3].position.includes("top") && /*$accountCenter$*/
    ctx[1].position.includes("top") && /*samePositionOrMobile*/
    ctx[7]
  );
  let div1_style_value;
  let current2;
  let if_block0 = show_if_1 && create_if_block_9(ctx);
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block_3,
    then: create_then_block_3,
    catch: create_catch_block_3,
    value: 23,
    blocks: [, , ,]
  };
  handle_promise(
    /*accountCenterComponent*/
    ctx[16],
    info
  );
  let if_block1 = show_if && create_if_block_6(ctx);
  return {
    c() {
      div1 = element("div");
      if (if_block0) if_block0.c();
      t0 = space();
      div0 = element("div");
      info.block.c();
      t1 = space();
      if (if_block1) if_block1.c();
      attr(div0, "id", "account-center-with-notify");
      attr(div1, "class", "container flex flex-column fixed z-indexed svelte-w5zexe");
      attr(div1, "style", div1_style_value = /*setPositioningDefaults*/
      ctx[15](accountCenterPositioning)[
        /*$accountCenter$*/
        ctx[1].position
      ] + "; " + /*device*/
      (ctx[11].type === "mobile" && /*$accountCenter$*/
      ctx[1].position.includes("top") ? "padding-bottom: 0;" : (
        /*device*/
        ctx[11].type === "mobile" && /*$accountCenter$*/
        ctx[1].position.includes("bottom") ? "padding-top:0;" : ""
      )));
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      if (if_block0) if_block0.m(div1, null);
      append(div1, t0);
      append(div1, div0);
      info.block.m(div0, info.anchor = null);
      info.mount = () => div0;
      info.anchor = null;
      append(div1, t1);
      if (if_block1) if_block1.m(div1, null);
      current2 = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*$notify$, $accountCenter$, samePositionOrMobile*/
      138) show_if_1 = /*$notify$*/
      ctx[3].position.includes("bottom") && /*$accountCenter$*/
      ctx[1].position.includes("bottom") && /*samePositionOrMobile*/
      ctx[7];
      if (show_if_1) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
          if (dirty & /*$notify$, $accountCenter$, samePositionOrMobile*/
          138) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_9(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div1, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      update_await_block_branch(info, ctx, dirty);
      if (dirty & /*$notify$, $accountCenter$, samePositionOrMobile*/
      138) show_if = /*$notify$*/
      ctx[3].position.includes("top") && /*$accountCenter$*/
      ctx[1].position.includes("top") && /*samePositionOrMobile*/
      ctx[7];
      if (show_if) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
          if (dirty & /*$notify$, $accountCenter$, samePositionOrMobile*/
          138) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_6(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div1, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (!current2 || dirty & /*$accountCenter$*/
      2 && div1_style_value !== (div1_style_value = /*setPositioningDefaults*/
      ctx[15](accountCenterPositioning)[
        /*$accountCenter$*/
        ctx[1].position
      ] + "; " + /*device*/
      (ctx[11].type === "mobile" && /*$accountCenter$*/
      ctx[1].position.includes("top") ? "padding-bottom: 0;" : (
        /*device*/
        ctx[11].type === "mobile" && /*$accountCenter$*/
        ctx[1].position.includes("bottom") ? "padding-top:0;" : ""
      )))) {
        attr(div1, "style", div1_style_value);
      }
    },
    i(local) {
      if (current2) return;
      transition_in(if_block0);
      transition_in(info.block);
      transition_in(if_block1);
      current2 = true;
    },
    o(local) {
      transition_out(if_block0);
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      transition_out(if_block1);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div1);
      if (if_block0) if_block0.d();
      info.block.d();
      info.token = null;
      info = null;
      if (if_block1) if_block1.d();
    }
  };
}
function create_if_block_9(ctx) {
  let await_block_anchor;
  let current2;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block_4,
    then: create_then_block_4,
    catch: create_catch_block_4,
    value: 22,
    blocks: [, , ,]
  };
  handle_promise(
    /*notifyComponent*/
    ctx[17],
    info
  );
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target, anchor) {
      insert(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current2 = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      update_await_block_branch(info, ctx, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(info.block);
      current2 = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(await_block_anchor);
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function create_catch_block_4(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block_4(ctx) {
  let if_block_anchor;
  let current2;
  let if_block = (
    /*Notify*/
    ctx[22] && create_if_block_10(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (
        /*Notify*/
        ctx2[22]
      ) if_block.p(ctx2, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_if_block_10(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current2;
  var switch_value = (
    /*Notify*/
    ctx[22]
  );
  function switch_props(ctx2) {
    return {
      props: {
        notifications: (
          /*$notifications$*/
          ctx2[10]
        ),
        position: (
          /*$notify$*/
          ctx2[3].position
        ),
        sharedContainer: (
          /*sharedContainer*/
          ctx2[0]
        )
      }
    };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = {};
      if (dirty & /*$notifications$*/
      1024) switch_instance_changes.notifications = /*$notifications$*/
      ctx2[10];
      if (dirty & /*$notify$*/
      8) switch_instance_changes.position = /*$notify$*/
      ctx2[3].position;
      if (dirty & /*sharedContainer*/
      1) switch_instance_changes.sharedContainer = /*sharedContainer*/
      ctx2[0];
      if (switch_value !== (switch_value = /*Notify*/
      ctx2[22])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current2) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_pending_block_4(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_catch_block_3(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block_3(ctx) {
  let if_block_anchor;
  let current2;
  let if_block = (
    /*AccountCenter*/
    ctx[23] && create_if_block_8(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (
        /*AccountCenter*/
        ctx2[23]
      ) if_block.p(ctx2, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_if_block_8(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current2;
  var switch_value = (
    /*AccountCenter*/
    ctx[23]
  );
  function switch_props(ctx2) {
    return {};
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props());
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (switch_value !== (switch_value = /*AccountCenter*/
      ctx2[23])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      }
    },
    i(local) {
      if (current2) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_pending_block_3(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_if_block_6(ctx) {
  let await_block_anchor;
  let current2;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block_2,
    then: create_then_block_2,
    catch: create_catch_block_2,
    value: 22,
    blocks: [, , ,]
  };
  handle_promise(
    /*notifyComponent*/
    ctx[17],
    info
  );
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target, anchor) {
      insert(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current2 = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      update_await_block_branch(info, ctx, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(info.block);
      current2 = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(await_block_anchor);
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function create_catch_block_2(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block_2(ctx) {
  let if_block_anchor;
  let current2;
  let if_block = (
    /*Notify*/
    ctx[22] && create_if_block_7(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (
        /*Notify*/
        ctx2[22]
      ) if_block.p(ctx2, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_if_block_7(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current2;
  var switch_value = (
    /*Notify*/
    ctx[22]
  );
  function switch_props(ctx2) {
    return {
      props: {
        notifications: (
          /*$notifications$*/
          ctx2[10]
        ),
        position: (
          /*$notify$*/
          ctx2[3].position
        ),
        sharedContainer: (
          /*sharedContainer*/
          ctx2[0]
        )
      }
    };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = {};
      if (dirty & /*$notifications$*/
      1024) switch_instance_changes.notifications = /*$notifications$*/
      ctx2[10];
      if (dirty & /*$notify$*/
      8) switch_instance_changes.position = /*$notify$*/
      ctx2[3].position;
      if (dirty & /*sharedContainer*/
      1) switch_instance_changes.sharedContainer = /*sharedContainer*/
      ctx2[0];
      if (switch_value !== (switch_value = /*Notify*/
      ctx2[22])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current2) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_pending_block_2(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_if_block_2(ctx) {
  let div1;
  let div0;
  let div1_style_value;
  let current2;
  let if_block = (
    /*$accountCenter$*/
    ctx[1].enabled && /*$wallets$*/
    ctx[2].length && create_if_block_3(ctx)
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (if_block) if_block.c();
      attr(div1, "class", "container flex flex-column fixed z-indexed svelte-w5zexe");
      attr(div1, "style", div1_style_value = /*setPositioningDefaults*/
      ctx[15](accountCenterPositioning)[
        /*$accountCenter$*/
        ctx[1].position
      ] + "; " + /*device*/
      (ctx[11].type === "mobile" && /*$accountCenter$*/
      ctx[1].position.includes("top") ? "padding-bottom: 0;" : (
        /*device*/
        ctx[11].type === "mobile" && /*$accountCenter$*/
        ctx[1].position.includes("bottom") ? "padding-top:0;" : ""
      )));
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (if_block) if_block.m(div0, null);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (
        /*$accountCenter$*/
        ctx2[1].enabled && /*$wallets$*/
        ctx2[2].length
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*$accountCenter$, $wallets$*/
          6) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div0, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (!current2 || dirty & /*$accountCenter$*/
      2 && div1_style_value !== (div1_style_value = /*setPositioningDefaults*/
      ctx2[15](accountCenterPositioning)[
        /*$accountCenter$*/
        ctx2[1].position
      ] + "; " + /*device*/
      (ctx2[11].type === "mobile" && /*$accountCenter$*/
      ctx2[1].position.includes("top") ? "padding-bottom: 0;" : (
        /*device*/
        ctx2[11].type === "mobile" && /*$accountCenter$*/
        ctx2[1].position.includes("bottom") ? "padding-top:0;" : ""
      )))) {
        attr(div1, "style", div1_style_value);
      }
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div1);
      if (if_block) if_block.d();
    }
  };
}
function create_if_block_3(ctx) {
  let await_block_anchor;
  let current2;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block_1,
    then: create_then_block_1,
    catch: create_catch_block_1,
    value: 23,
    blocks: [, , ,]
  };
  handle_promise(
    /*accountCenterComponent*/
    ctx[16],
    info
  );
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target, anchor) {
      insert(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current2 = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      update_await_block_branch(info, ctx, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(info.block);
      current2 = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(await_block_anchor);
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function create_catch_block_1(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block_1(ctx) {
  let if_block_anchor;
  let current2;
  let if_block = (
    /*AccountCenter*/
    ctx[23] && create_if_block_4(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (
        /*AccountCenter*/
        ctx2[23]
      ) if_block.p(ctx2, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_if_block_4(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current2;
  var switch_value = (
    /*AccountCenter*/
    ctx[23]
  );
  function switch_props(ctx2) {
    return {};
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props());
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (switch_value !== (switch_value = /*AccountCenter*/
      ctx2[23])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      }
    },
    i(local) {
      if (current2) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_pending_block_1(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_if_block(ctx) {
  let div;
  let div_style_value;
  let current2;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block,
    then: create_then_block,
    catch: create_catch_block,
    value: 22,
    blocks: [, , ,]
  };
  handle_promise(
    /*notifyComponent*/
    ctx[17],
    info
  );
  return {
    c() {
      div = element("div");
      info.block.c();
      attr(div, "class", "container flex flex-column fixed z-indexed svelte-w5zexe");
      attr(div, "style", div_style_value = /*setPositioningDefaults*/
      ctx[15](notifyPositioning)[
        /*$notify$*/
        ctx[3].position
      ] + "; " + /*device*/
      (ctx[11].type === "mobile" && /*$notify$*/
      ctx[3].position.includes("top") ? "padding-bottom: 0;" : (
        /*device*/
        ctx[11].type === "mobile" && /*$notify$*/
        ctx[3].position.includes("bottom") ? "padding-top:0;" : ""
      )));
    },
    m(target, anchor) {
      insert(target, div, anchor);
      info.block.m(div, info.anchor = null);
      info.mount = () => div;
      info.anchor = null;
      current2 = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      update_await_block_branch(info, ctx, dirty);
      if (!current2 || dirty & /*$notify$*/
      8 && div_style_value !== (div_style_value = /*setPositioningDefaults*/
      ctx[15](notifyPositioning)[
        /*$notify$*/
        ctx[3].position
      ] + "; " + /*device*/
      (ctx[11].type === "mobile" && /*$notify$*/
      ctx[3].position.includes("top") ? "padding-bottom: 0;" : (
        /*device*/
        ctx[11].type === "mobile" && /*$notify$*/
        ctx[3].position.includes("bottom") ? "padding-top:0;" : ""
      )))) {
        attr(div, "style", div_style_value);
      }
    },
    i(local) {
      if (current2) return;
      transition_in(info.block);
      current2 = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      info.block.d();
      info.token = null;
      info = null;
    }
  };
}
function create_catch_block(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block(ctx) {
  let if_block_anchor;
  let current2;
  let if_block = (
    /*Notify*/
    ctx[22] && create_if_block_1(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      if (
        /*Notify*/
        ctx2[22]
      ) if_block.p(ctx2, dirty);
    },
    i(local) {
      if (current2) return;
      transition_in(if_block);
      current2 = true;
    },
    o(local) {
      transition_out(if_block);
      current2 = false;
    },
    d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function create_if_block_1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current2;
  var switch_value = (
    /*Notify*/
    ctx[22]
  );
  function switch_props(ctx2) {
    return {
      props: {
        notifications: (
          /*$notifications$*/
          ctx2[10]
        ),
        position: (
          /*$notify$*/
          ctx2[3].position
        ),
        sharedContainer: (
          /*sharedContainer*/
          ctx2[0]
        )
      }
    };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current2 = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = {};
      if (dirty & /*$notifications$*/
      1024) switch_instance_changes.notifications = /*$notifications$*/
      ctx2[10];
      if (dirty & /*$notify$*/
      8) switch_instance_changes.position = /*$notify$*/
      ctx2[3].position;
      if (dirty & /*sharedContainer*/
      1) switch_instance_changes.sharedContainer = /*sharedContainer*/
      ctx2[0];
      if (switch_value !== (switch_value = /*Notify*/
      ctx2[22])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current2) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current2 = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current2 = false;
    },
    d(detaching) {
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_pending_block(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_fragment(ctx) {
  let t0;
  let t1;
  let t2;
  let t3;
  let t4;
  let if_block5_anchor;
  let current2;
  let if_block0 = (
    /*$connectWallet$*/
    ctx[8].inProgress && create_if_block_13(ctx)
  );
  let if_block1 = (
    /*$connectWallet$*/
    ctx[8].actionRequired && create_if_block_12(ctx)
  );
  let if_block2 = (
    /*$switchChainModal$*/
    ctx[9] && create_if_block_11()
  );
  let if_block3 = (
    /*displayAccountCenterNotifySameContainer*/
    ctx[4] && create_if_block_5(ctx)
  );
  let if_block4 = (
    /*displayAccountCenterSeparate*/
    ctx[5] && create_if_block_2(ctx)
  );
  let if_block5 = (
    /*displayNotifySeparate*/
    ctx[6] && create_if_block(ctx)
  );
  return {
    c() {
      if (if_block0) if_block0.c();
      t0 = space();
      if (if_block1) if_block1.c();
      t1 = space();
      if (if_block2) if_block2.c();
      t2 = space();
      if (if_block3) if_block3.c();
      t3 = space();
      if (if_block4) if_block4.c();
      t4 = space();
      if (if_block5) if_block5.c();
      if_block5_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0) if_block0.m(target, anchor);
      insert(target, t0, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, t1, anchor);
      if (if_block2) if_block2.m(target, anchor);
      insert(target, t2, anchor);
      if (if_block3) if_block3.m(target, anchor);
      insert(target, t3, anchor);
      if (if_block4) if_block4.m(target, anchor);
      insert(target, t4, anchor);
      if (if_block5) if_block5.m(target, anchor);
      insert(target, if_block5_anchor, anchor);
      current2 = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*$connectWallet$*/
        ctx2[8].inProgress
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*$connectWallet$*/
          256) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_13(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*$connectWallet$*/
        ctx2[8].actionRequired
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & /*$connectWallet$*/
          256) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_12(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t1.parentNode, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (
        /*$switchChainModal$*/
        ctx2[9]
      ) {
        if (if_block2) {
          if (dirty & /*$switchChainModal$*/
          512) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_11();
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(t2.parentNode, t2);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      if (
        /*displayAccountCenterNotifySameContainer*/
        ctx2[4]
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
          if (dirty & /*displayAccountCenterNotifySameContainer*/
          16) {
            transition_in(if_block3, 1);
          }
        } else {
          if_block3 = create_if_block_5(ctx2);
          if_block3.c();
          transition_in(if_block3, 1);
          if_block3.m(t3.parentNode, t3);
        }
      } else if (if_block3) {
        group_outros();
        transition_out(if_block3, 1, 1, () => {
          if_block3 = null;
        });
        check_outros();
      }
      if (
        /*displayAccountCenterSeparate*/
        ctx2[5]
      ) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
          if (dirty & /*displayAccountCenterSeparate*/
          32) {
            transition_in(if_block4, 1);
          }
        } else {
          if_block4 = create_if_block_2(ctx2);
          if_block4.c();
          transition_in(if_block4, 1);
          if_block4.m(t4.parentNode, t4);
        }
      } else if (if_block4) {
        group_outros();
        transition_out(if_block4, 1, 1, () => {
          if_block4 = null;
        });
        check_outros();
      }
      if (
        /*displayNotifySeparate*/
        ctx2[6]
      ) {
        if (if_block5) {
          if_block5.p(ctx2, dirty);
          if (dirty & /*displayNotifySeparate*/
          64) {
            transition_in(if_block5, 1);
          }
        } else {
          if_block5 = create_if_block(ctx2);
          if_block5.c();
          transition_in(if_block5, 1);
          if_block5.m(if_block5_anchor.parentNode, if_block5_anchor);
        }
      } else if (if_block5) {
        group_outros();
        transition_out(if_block5, 1, 1, () => {
          if_block5 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current2) return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(if_block2);
      transition_in(if_block3);
      transition_in(if_block4);
      transition_in(if_block5);
      current2 = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(if_block2);
      transition_out(if_block3);
      transition_out(if_block4);
      transition_out(if_block5);
      current2 = false;
    },
    d(detaching) {
      if (if_block0) if_block0.d(detaching);
      if (detaching) detach(t0);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(t1);
      if (if_block2) if_block2.d(detaching);
      if (detaching) detach(t2);
      if (if_block3) if_block3.d(detaching);
      if (detaching) detach(t3);
      if (if_block4) if_block4.d(detaching);
      if (detaching) detach(t4);
      if (if_block5) if_block5.d(detaching);
      if (detaching) detach(if_block5_anchor);
    }
  };
}
const accountCenterPositioning = "account-center";
const notifyPositioning = "notify-onboard-container";
function instance($$self, $$props, $$invalidate) {
  let sharedContainer;
  let samePositionOrMobile;
  let sharedMobileContainerCheck;
  let displayNotifySeparate;
  let displayAccountCenterSeparate;
  let displayAccountCenterNotifySameContainer;
  let $accountCenter$;
  let $wallets$;
  let $notify$;
  let $connectWallet$;
  let $switchChainModal$;
  let $notifications$;
  component_subscribe($$self, wallets$, ($$value) => $$invalidate(2, $wallets$ = $$value));
  component_subscribe($$self, connectWallet$, ($$value) => $$invalidate(8, $connectWallet$ = $$value));
  component_subscribe($$self, switchChainModal$, ($$value) => $$invalidate(9, $switchChainModal$ = $$value));
  const { device, containerElements: containerElements2 } = configuration;
  const accountCenter$ = state.select("accountCenter").pipe(startWith(state.get().accountCenter), shareReplay(1));
  component_subscribe($$self, accountCenter$, (value) => $$invalidate(1, $accountCenter$ = value));
  const notify$ = state.select("notify").pipe(startWith(state.get().notify), shareReplay(1));
  component_subscribe($$self, notify$, (value) => $$invalidate(3, $notify$ = value));
  const notifications$ = state.select("notifications").pipe(startWith(state.get().notifications));
  component_subscribe($$self, notifications$, (value) => $$invalidate(10, $notifications$ = value));
  const setPositioningDefaults = (targetComponentVariable) => {
    return {
      topLeft: `
        top: var(--${targetComponentVariable}-position-top, 0); 
        left: var(--${targetComponentVariable}-position-left, 0);`,
      topRight: `
        top: var(--${targetComponentVariable}-position-top, 0); 
        right: var(--${targetComponentVariable}-position-right, 0);`,
      bottomRight: `
        bottom: var(--${targetComponentVariable}-position-bottom, 0); 
        right: var(--${targetComponentVariable}-position-right, 0);`,
      bottomLeft: `
        bottom: var(--${targetComponentVariable}-position-bottom, 0); 
        left: var(--${targetComponentVariable}-position-left, 0);`
    };
  };
  const accountCenterComponent = $accountCenter$.enabled ? import("./Index-fb68189d.js").then((mod) => mod.default) : Promise.resolve(null);
  const notifyComponent = $notify$.enabled ? import("./Index-bf757f44.js").then((mod) => mod.default) : Promise.resolve(null);
  const accountCenterMountToElement = $accountCenter$.enabled && containerElements2 && containerElements2.accountCenter;
  const attachCompToDom = (domEl, targetEl, component, compSettings) => {
    const target = domEl.attachShadow({ mode: "open" });
    let getW3OEl = document.querySelector("onboard-v2");
    let w3OStyleSheets = getW3OEl.shadowRoot.styleSheets;
    const copiedStyleSheet = new CSSStyleSheet();
    Object.values(w3OStyleSheets).forEach((sheet) => {
      const styleRules = Object.values(sheet.cssRules);
      styleRules.forEach((rule) => copiedStyleSheet.insertRule(rule.cssText));
    });
    target.adoptedStyleSheets = [copiedStyleSheet];
    const containerElement = document.querySelector(targetEl);
    containerElement.appendChild(domEl);
    if (!containerElement) {
      throw new Error(`Element with query ${targetEl} does not exist.`);
    }
    const getACComp = async () => {
      let newComp = await component;
      if (newComp) {
        new newComp({
          target,
          props: {
            settings: compSettings,
            mountInContainer: true
          }
        });
      }
    };
    getACComp();
  };
  if (accountCenterMountToElement) {
    const accountCenter2 = document.createElement("onboard-account-center");
    attachCompToDom(accountCenter2, accountCenterMountToElement, accountCenterComponent, $accountCenter$);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$accountCenter$, $notify$*/
    10) {
      $$invalidate(0, sharedContainer = !accountCenterMountToElement && $accountCenter$.enabled && $notify$.enabled && $notify$.position === $accountCenter$.position);
    }
    if ($$self.$$.dirty & /*$accountCenter$, $notify$*/
    10) {
      $$invalidate(7, samePositionOrMobile = device.type === "mobile" || $accountCenter$.position === $notify$.position);
    }
    if ($$self.$$.dirty & /*$notify$, $accountCenter$*/
    10) {
      $$invalidate(18, sharedMobileContainerCheck = $notify$.position.includes("bottom") && $accountCenter$.position.includes("bottom") || $notify$.position.includes("top") && $accountCenter$.position.includes("top"));
    }
    if ($$self.$$.dirty & /*$notify$, $accountCenter$, sharedMobileContainerCheck, $wallets$*/
    262158) {
      $$invalidate(6, displayNotifySeparate = $notify$.enabled && (!$accountCenter$.enabled || accountCenterMountToElement || $notify$.position !== $accountCenter$.position && device.type !== "mobile" || device.type === "mobile" && !sharedMobileContainerCheck || !$wallets$.length));
    }
    if ($$self.$$.dirty & /*$accountCenter$, $notify$, sharedMobileContainerCheck, $wallets$*/
    262158) {
      $$invalidate(5, displayAccountCenterSeparate = $accountCenter$.enabled && (!$notify$.enabled || $notify$.position !== $accountCenter$.position && device.type !== "mobile" || device.type === "mobile" && !sharedMobileContainerCheck) && $wallets$.length);
    }
    if ($$self.$$.dirty & /*$notify$, $accountCenter$, sharedContainer, sharedMobileContainerCheck, $wallets$*/
    262159) {
      $$invalidate(4, displayAccountCenterNotifySameContainer = $notify$.enabled && $accountCenter$.enabled && (sharedContainer || device.type === "mobile" && sharedMobileContainerCheck) && $wallets$.length);
    }
  };
  return [
    sharedContainer,
    $accountCenter$,
    $wallets$,
    $notify$,
    displayAccountCenterNotifySameContainer,
    displayAccountCenterSeparate,
    displayNotifySeparate,
    samePositionOrMobile,
    $connectWallet$,
    $switchChainModal$,
    $notifications$,
    device,
    accountCenter$,
    notify$,
    notifications$,
    setPositioningDefaults,
    accountCenterComponent,
    notifyComponent,
    sharedMobileContainerCheck
  ];
}
class Index extends SvelteComponent {
  constructor(options2) {
    super();
    init$1(this, options2, instance, create_fragment, safe_not_equal, {}, add_css);
  }
}
const API = {
  connectWallet: connect$1,
  disconnectWallet: disconnect,
  setChain,
  state: {
    get: state.get,
    select: state.select,
    actions: {
      setWalletModules,
      setLocale,
      updateNotify,
      customNotification,
      updateBalances,
      updateAccountCenter,
      setPrimaryWallet,
      updateTheme,
      updateAppMetadata
    }
  }
};
function init(options2) {
  if (typeof window === "undefined")
    return API;
  if (options2) {
    const error = validateInitOptions(options2);
    if (error) {
      throw error;
    }
  }
  const { wallets: wallets2, chains: chains2, appMetadata: appMetadata2, i18n, accountCenter: accountCenter2, notify: notify2, gas, connect: connect2, containerElements: containerElements2, transactionPreview, theme: theme2, disableFontDownload, unstoppableResolution, wagmi } = options2;
  if (containerElements2)
    updateConfiguration({ containerElements: containerElements2 });
  const { device, svelteInstance } = configuration;
  if (svelteInstance) {
    console.warn("Re-initializing Onboard and resetting back to initial state");
    reset$.next();
  }
  initialize(i18n);
  addChains(chainIdToHex(chains2));
  if (typeof connect2 !== "undefined") {
    updateConnectModal(connect2);
  }
  if (typeof accountCenter2 !== "undefined") {
    let accountCenterUpdate;
    const { hideTransactionProtectionBtn, transactionProtectionInfoLink } = accountCenter2;
    if (device.type === "mobile") {
      accountCenterUpdate = Object.assign(Object.assign(Object.assign({}, APP_INITIAL_STATE.accountCenter), {
        hideTransactionProtectionBtn,
        transactionProtectionInfoLink
      }), accountCenter2.mobile ? accountCenter2.mobile : {});
    } else if (accountCenter2.desktop) {
      accountCenterUpdate = Object.assign(Object.assign(Object.assign({}, APP_INITIAL_STATE.accountCenter), {
        hideTransactionProtectionBtn,
        transactionProtectionInfoLink
      }), accountCenter2.desktop);
    }
    if (typeof accountCenterUpdate !== "undefined") {
      updateAccountCenter(accountCenterUpdate);
    }
  }
  let wagmiApi;
  if (typeof wagmi !== "undefined") {
    wagmiApi = wagmi(Object.assign({ disconnect, updateChain }, wagmiProviderMethods()));
  }
  if (typeof notify2 !== "undefined") {
    console.warn(`Support for notifications on transaction state changes have been deprecated. Custom notifications can still be sent ot the user.`);
    if ("desktop" in notify2 || "mobile" in notify2) {
      const error = validateNotifyOptions(notify2);
      if (error) {
        throw error;
      }
      if (notify2 && notify2.desktop && notify2.desktop.position && accountCenter2 && accountCenter2.desktop && accountCenter2.desktop.position) {
        notify2.desktop.position = accountCenter2.desktop.position;
      }
      if (notify2 && notify2.mobile && notify2.mobile.position && accountCenter2 && accountCenter2.mobile && accountCenter2.mobile.position) {
        notify2.mobile.position = accountCenter2.mobile.position;
      }
      let notifyUpdate = {};
      if (device.type === "mobile" && notify2.mobile) {
        notifyUpdate = Object.assign(Object.assign({}, APP_INITIAL_STATE.notify), notify2.mobile);
      } else if (notify2.desktop) {
        notifyUpdate = Object.assign(Object.assign({}, APP_INITIAL_STATE.notify), notify2.desktop);
      }
      updateNotify(notifyUpdate);
    } else {
      const error = validateNotify(notify2);
      if (error) {
        throw error;
      }
      const notifyUpdate = Object.assign(Object.assign({}, APP_INITIAL_STATE.notify), notify2);
      updateNotify(notifyUpdate);
    }
  } else {
    const notifyUpdate = APP_INITIAL_STATE.notify;
    updateNotify(notifyUpdate);
  }
  const app = svelteInstance || mountApp(theme2 || {}, disableFontDownload || false);
  updateConfiguration({
    svelteInstance: app,
    initialWalletInit: wallets2,
    gas,
    unstoppableResolution,
    wagmi: wagmiApi
  });
  appMetadata2 && updateAppMetadata(appMetadata2);
  if (transactionPreview) {
    console.error("Transaction Preview support has been removed and is no longer supported within Web3-Onboard");
  }
  theme2 && updateTheme(theme2);
  if (connect2 && (connect2.autoConnectLastWallet || connect2.autoConnectAllPreviousWallet)) {
    const lastConnectedWallets = getLocalStore(STORAGE_KEYS.LAST_CONNECTED_WALLET);
    try {
      const lastConnectedWalletsParsed = JSON.parse(lastConnectedWallets);
      if (lastConnectedWalletsParsed && Array.isArray(lastConnectedWalletsParsed) && lastConnectedWalletsParsed.length) {
        connectAllPreviousWallets(lastConnectedWalletsParsed, connect2);
      }
      if (lastConnectedWalletsParsed && typeof lastConnectedWalletsParsed === "string") {
        connectAllPreviousWallets([lastConnectedWalletsParsed], connect2);
      }
    } catch (err) {
      if (err instanceof SyntaxError && lastConnectedWallets) {
        API.connectWallet({
          autoSelect: {
            label: lastConnectedWallets,
            disableModals: true
          }
        });
      }
    }
  }
  return API;
}
const fontFamilyExternallyDefined = (theme2, disableFontDownload) => {
  if (disableFontDownload)
    return true;
  if (document.body && (getComputedStyle(document.body).getPropertyValue("--onboard-font-family-normal") || getComputedStyle(document.body).getPropertyValue("--w3o-font-family")))
    return true;
  if (!theme2)
    return false;
  if (typeof theme2 === "object" && theme2["--w3o-font-family"])
    return true;
  return false;
};
const importInterFont = async () => {
  const { InterVar } = await import("@web3-onboard/common");
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    ${InterVar}
  `;
  document.body.appendChild(styleEl);
};
const connectAllPreviousWallets = async (lastConnectedWallets, connect2) => {
  const activeWalletsList = [];
  const parsedWalletList = lastConnectedWallets;
  if (!connect2.autoConnectAllPreviousWallet) {
    API.connectWallet({
      autoSelect: { label: parsedWalletList[0], disableModals: true }
    });
    activeWalletsList.push(parsedWalletList[0]);
  } else {
    for (let i = parsedWalletList.length; i--; ) {
      const walletConnectionPromise = await API.connectWallet({
        autoSelect: { label: parsedWalletList[i], disableModals: true }
      });
      if (walletConnectionPromise.some((r) => r.label === parsedWalletList[i])) {
        activeWalletsList.unshift(parsedWalletList[i]);
      }
    }
  }
  setLocalStore(STORAGE_KEYS.LAST_CONNECTED_WALLET, JSON.stringify(activeWalletsList));
};
function mountApp(theme2, disableFontDownload) {
  class Onboard extends HTMLElement {
    constructor() {
      super();
    }
  }
  if (!customElements.get("onboard-v2")) {
    customElements.define("onboard-v2", Onboard);
  }
  if (!fontFamilyExternallyDefined(theme2, disableFontDownload)) {
    importInterFont();
  }
  const onboard = document.createElement("onboard-v2");
  const target = onboard.attachShadow({ mode: "open" });
  onboard.style.all = "initial";
  target.innerHTML = `

  <style>
    :host {
          /* COLORS */
          --white: white;
          --black: black;
          --primary-1: #2F80ED;
          --primary-100: #eff1fc;
          --primary-200: #d0d4f7;
          --primary-300: #b1b8f2;
          --primary-400: #929bed;
          --primary-500: #6370e5;
          --primary-600: #454ea0;
          --primary-700: #323873;
          --gray-100: #ebebed;
          --gray-200: #c2c4c9;
          --gray-300: #999ca5;
          --gray-400: #707481;
          --gray-500: #33394b;
          --gray-600: #242835;
          --gray-700: #1a1d26;
          --success-100: #d1fae3;
          --success-200: #baf7d5;
          --success-300: #a4f4c6;
          --success-400: #8df2b8;
          --success-500: #5aec99;
          --success-600: #18ce66;
          --success-700: #129b4d;
          --danger-100: #ffe5e6;
          --danger-200: #ffcccc;
          --danger-300: #ffb3b3;
          --danger-400: #ff8080;
          --danger-500: #ff4f4f;
          --danger-600: #cc0000;
          --danger-700: #660000;
          --warning-100: #ffefcc;
          --warning-200: #ffe7b3;
          --warning-300: #ffd780;
          --warning-400: #ffc74c;
          --warning-500: #ffaf00;
          --warning-600: #cc8c00;
          --warning-700: #664600;

          /* FONTS */
          --font-family-normal: var(--w3o-font-family, Inter, sans-serif);

          --font-size-1: 3rem;
          --font-size-2: 2.25rem;
          --font-size-3: 1.5rem;
          --font-size-4: 1.25rem;
          --font-size-5: 1rem;
          --font-size-6: .875rem;
          --font-size-7: .75rem;

          --font-line-height-1: 24px;
          --font-line-height-2: 20px;
          --font-line-height-3: 16px;
          --font-line-height-4: 12px;

          /* SPACING */
          --spacing-1: 3rem;
          --spacing-2: 2rem;
          --spacing-3: 1.5rem;
          --spacing-4: 1rem;
          --spacing-5: 0.5rem;
          --spacing-6: 0.25rem;
          --spacing-7: 0.125rem;

          /* BORDER RADIUS */
          --border-radius-1: 24px;
          --border-radius-2: 20px;
          --border-radius-3: 16px;
          --border-radius-4: 12px;
          --border-radius-5: 8px;

          /* SHADOWS */
          --shadow-0: none;
          --shadow-1: 0px 4px 12px rgba(0, 0, 0, 0.1);
          --shadow-2: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
          --shadow-3: 0px 4px 16px rgba(0, 0, 0, 0.2);

          /* MODAL POSITIONING */
          --modal-z-index: 10;
          --modal-top: unset;
          --modal-right: unset;
          --modal-bottom: unset;
          --modal-left: unset;

          /* MODAL STYLES */
          --modal-backdrop: rgba(0, 0, 0, 0.6);

        }
      </style>
    `;
  let connectModalContEl;
  if (configuration && configuration.containerElements && configuration.containerElements.connectModal) {
    connectModalContEl = configuration.containerElements.connectModal;
  }
  const containerElementQuery = connectModalContEl || state.get().accountCenter.containerElement || "body";
  const containerElement = document.querySelector(containerElementQuery);
  if (!containerElement) {
    throw new Error(`Element with query ${containerElementQuery} does not exist.`);
  }
  containerElement.appendChild(onboard);
  const app = new Index({
    target
  });
  return app;
}
const PULSECHAIN_ID = "0x171";
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { wallet: wallet2 } = $$props;
  let { onboard } = $$props;
  let wrongNetwork = false;
  async function checkNetwork() {
    if (!wallet2) return;
    const chainId = wallet2.chains[0].id;
    wrongNetwork = chainId !== PULSECHAIN_ID;
    if (wrongNetwork) {
      try {
        await onboard.setChain({ chainId: PULSECHAIN_ID });
        wrongNetwork = false;
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    }
  }
  if ($$props.wallet === void 0 && $$bindings.wallet && wallet2 !== void 0) $$bindings.wallet(wallet2);
  if ($$props.onboard === void 0 && $$bindings.onboard && onboard !== void 0) $$bindings.onboard(onboard);
  {
    if (wallet2) {
      wallet2.provider.on("chainChanged", () => {
        checkNetwork();
      });
    }
  }
  return `<nav class="bg-[#1c1f2a] py-4 px-6 shadow-lg"><div class="max-w-7xl mx-auto flex justify-between items-center"><div class="flex items-center" data-svelte-h="svelte-m10ef8"><img src="https://raw.githubusercontent.com/jaxnalia/lean-frontend-master/refs/heads/main/src/lib/images/lean.png" alt="Logo" class="h-8 w-8"> <span class="ml-2 text-xl font-bold text-white">LEAN Farm</span></div> ${wrongNetwork ? `<div class="flex items-center"><span class="text-red-500 mr-4" data-svelte-h="svelte-1v173or">Wrong Network</span> <button class="btn-primary" data-svelte-h="svelte-wpfv7h">Switch to PulseChain</button></div>` : `<button class="${"btn-primary " + escape("", true)}" ${""}>${`${wallet2 ? `${escape(wallet2.accounts[0].address.slice(0, 6))}...${escape(wallet2.accounts[0].address.slice(-4))}` : `Connect Wallet`}`}</button>`}</div></nav>`;
});
function calculateOffset(toast2, $toasts, opts) {
  const { reverseOrder, gutter = 8, defaultPosition } = opts || {};
  const relevantToasts = $toasts.filter((t) => (t.position || defaultPosition) === (toast2.position || defaultPosition) && t.height);
  const toastIndex = relevantToasts.findIndex((t) => t.id === toast2.id);
  const toastsBefore = relevantToasts.filter((toast3, i) => i < toastIndex && toast3.visible).length;
  const offset = relevantToasts.filter((t) => t.visible).slice(...reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]).reduce((acc, t) => acc + (t.height || 0) + gutter, 0);
  return offset;
}
const handlers = {
  startPause() {
    startPause(Date.now());
  },
  endPause() {
    endPause(Date.now());
  },
  updateHeight: (toastId, height) => {
    update$1({ id: toastId, height });
  },
  calculateOffset
};
function useToaster(toastOptions) {
  const { toasts, pausedAt } = useToasterStore(toastOptions);
  const timeouts = /* @__PURE__ */ new Map();
  let _pausedAt;
  const unsubscribes = [
    pausedAt.subscribe(($pausedAt) => {
      if ($pausedAt) {
        for (const [, timeoutId] of timeouts) {
          clearTimeout(timeoutId);
        }
        timeouts.clear();
      }
      _pausedAt = $pausedAt;
    }),
    toasts.subscribe(($toasts) => {
      if (_pausedAt) {
        return;
      }
      const now2 = Date.now();
      for (const t of $toasts) {
        if (timeouts.has(t.id)) {
          continue;
        }
        if (t.duration === Infinity) {
          continue;
        }
        const durationLeft = (t.duration || 0) + t.pauseDuration - (now2 - t.createdAt);
        if (durationLeft < 0) {
          if (t.visible) {
            toast.dismiss(t.id);
          }
          return null;
        }
        timeouts.set(t.id, setTimeout(() => toast.dismiss(t.id), durationLeft));
      }
    })
  ];
  onDestroy$1(() => {
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }
  });
  return { toasts, handlers };
}
const css$7 = {
  code: "div.svelte-11kvm4p{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--primary, #61d345);position:relative;transform:rotate(45deg);animation:svelte-11kvm4p-circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;animation-delay:100ms}div.svelte-11kvm4p::after{content:'';box-sizing:border-box;animation:svelte-11kvm4p-checkmarkAnimation 0.2s ease-out forwards;opacity:0;animation-delay:200ms;position:absolute;border-right:2px solid;border-bottom:2px solid;border-color:var(--secondary, #fff);bottom:6px;left:6px;height:10px;width:6px}@keyframes svelte-11kvm4p-circleAnimation{from{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes svelte-11kvm4p-checkmarkAnimation{0%{height:0;width:0;opacity:0}40%{height:0;width:6px;opacity:1}100%{opacity:1;height:10px}}",
  map: `{"version":3,"file":"CheckmarkIcon.svelte","sources":["CheckmarkIcon.svelte"],"sourcesContent":["<!-- Adapted from https://github.com/timolins/react-hot-toast -->\\n<script>export let primary = \\"#61d345\\";\\nexport let secondary = \\"#fff\\";\\n<\/script>\\n\\n<div style:--primary={primary} style:--secondary={secondary} />\\n\\n<style>\\n\\tdiv {\\n\\t\\twidth: 20px;\\n\\t\\topacity: 0;\\n\\t\\theight: 20px;\\n\\t\\tborder-radius: 10px;\\n\\t\\tbackground: var(--primary, #61d345);\\n\\t\\tposition: relative;\\n\\t\\ttransform: rotate(45deg);\\n\\t\\tanimation: circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;\\n\\t\\tanimation-delay: 100ms;\\n\\t}\\n\\n\\tdiv::after {\\n\\t\\tcontent: '';\\n\\t\\tbox-sizing: border-box;\\n\\t\\tanimation: checkmarkAnimation 0.2s ease-out forwards;\\n\\t\\topacity: 0;\\n\\t\\tanimation-delay: 200ms;\\n\\t\\tposition: absolute;\\n\\t\\tborder-right: 2px solid;\\n\\t\\tborder-bottom: 2px solid;\\n\\t\\tborder-color: var(--secondary, #fff);\\n\\t\\tbottom: 6px;\\n\\t\\tleft: 6px;\\n\\t\\theight: 10px;\\n\\t\\twidth: 6px;\\n\\t}\\n\\n\\t@keyframes circleAnimation {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0) rotate(45deg);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1) rotate(45deg);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes checkmarkAnimation {\\n\\t\\t0% {\\n\\t\\t\\theight: 0;\\n\\t\\t\\twidth: 0;\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\t40% {\\n\\t\\t\\theight: 0;\\n\\t\\t\\twidth: 6px;\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\topacity: 1;\\n\\t\\t\\theight: 10px;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAQC,kBAAI,CACH,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,IAAI,SAAS,CAAC,QAAQ,CAAC,CACnC,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,OAAO,KAAK,CAAC,CACxB,SAAS,CAAE,8BAAe,CAAC,IAAI,CAAC,aAAa,KAAK,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,QAAQ,CAChF,eAAe,CAAE,KAClB,CAEA,kBAAG,OAAQ,CACV,OAAO,CAAE,EAAE,CACX,UAAU,CAAE,UAAU,CACtB,SAAS,CAAE,iCAAkB,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,CACpD,OAAO,CAAE,CAAC,CACV,eAAe,CAAE,KAAK,CACtB,QAAQ,CAAE,QAAQ,CAClB,YAAY,CAAE,GAAG,CAAC,KAAK,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CACxB,YAAY,CAAE,IAAI,WAAW,CAAC,KAAK,CAAC,CACpC,MAAM,CAAE,GAAG,CACX,IAAI,CAAE,GAAG,CACT,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,GACR,CAEA,WAAW,8BAAgB,CAC1B,IAAK,CACJ,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACD,CAEA,WAAW,iCAAmB,CAC7B,EAAG,CACF,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,CAAC,CACR,OAAO,CAAE,CACV,CACA,GAAI,CACH,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,GAAG,CACV,OAAO,CAAE,CACV,CACA,IAAK,CACJ,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,IACT,CACD"}`
};
const CheckmarkIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#61d345" } = $$props;
  let { secondary = "#fff" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0) $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0) $$bindings.secondary(secondary);
  $$result.css.add(css$7);
  return `  <div class="svelte-11kvm4p"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$6 = {
  code: "div.svelte-1ee93ns{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--primary, #ff4b4b);position:relative;transform:rotate(45deg);animation:svelte-1ee93ns-circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;animation-delay:100ms}div.svelte-1ee93ns::after,div.svelte-1ee93ns::before{content:'';animation:svelte-1ee93ns-firstLineAnimation 0.15s ease-out forwards;animation-delay:150ms;position:absolute;border-radius:3px;opacity:0;background:var(--secondary, #fff);bottom:9px;left:4px;height:2px;width:12px}div.svelte-1ee93ns:before{animation:svelte-1ee93ns-secondLineAnimation 0.15s ease-out forwards;animation-delay:180ms;transform:rotate(90deg)}@keyframes svelte-1ee93ns-circleAnimation{from{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes svelte-1ee93ns-firstLineAnimation{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}@keyframes svelte-1ee93ns-secondLineAnimation{from{transform:scale(0) rotate(90deg);opacity:0}to{transform:scale(1) rotate(90deg);opacity:1}}",
  map: `{"version":3,"file":"ErrorIcon.svelte","sources":["ErrorIcon.svelte"],"sourcesContent":["<!-- Adapted from https://github.com/timolins/react-hot-toast -->\\n<script>export let primary = \\"#ff4b4b\\";\\nexport let secondary = \\"#fff\\";\\n<\/script>\\n\\n<div style:--primary={primary} style:--secondary={secondary} />\\n\\n<style>\\n\\tdiv {\\n\\t\\twidth: 20px;\\n\\t\\topacity: 0;\\n\\t\\theight: 20px;\\n\\t\\tborder-radius: 10px;\\n\\t\\tbackground: var(--primary, #ff4b4b);\\n\\t\\tposition: relative;\\n\\t\\ttransform: rotate(45deg);\\n\\t\\tanimation: circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;\\n\\t\\tanimation-delay: 100ms;\\n\\t}\\n\\n\\tdiv::after,\\n\\tdiv::before {\\n\\t\\tcontent: '';\\n\\t\\tanimation: firstLineAnimation 0.15s ease-out forwards;\\n\\t\\tanimation-delay: 150ms;\\n\\t\\tposition: absolute;\\n\\t\\tborder-radius: 3px;\\n\\t\\topacity: 0;\\n\\t\\tbackground: var(--secondary, #fff);\\n\\t\\tbottom: 9px;\\n\\t\\tleft: 4px;\\n\\t\\theight: 2px;\\n\\t\\twidth: 12px;\\n\\t}\\n\\n\\tdiv:before {\\n\\t\\tanimation: secondLineAnimation 0.15s ease-out forwards;\\n\\t\\tanimation-delay: 180ms;\\n\\t\\ttransform: rotate(90deg);\\n\\t}\\n\\n\\t@keyframes circleAnimation {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0) rotate(45deg);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1) rotate(45deg);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes firstLineAnimation {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes secondLineAnimation {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0) rotate(90deg);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1) rotate(90deg);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAQC,kBAAI,CACH,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,IAAI,SAAS,CAAC,QAAQ,CAAC,CACnC,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,OAAO,KAAK,CAAC,CACxB,SAAS,CAAE,8BAAe,CAAC,IAAI,CAAC,aAAa,KAAK,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,QAAQ,CAChF,eAAe,CAAE,KAClB,CAEA,kBAAG,OAAO,CACV,kBAAG,QAAS,CACX,OAAO,CAAE,EAAE,CACX,SAAS,CAAE,iCAAkB,CAAC,KAAK,CAAC,QAAQ,CAAC,QAAQ,CACrD,eAAe,CAAE,KAAK,CACtB,QAAQ,CAAE,QAAQ,CAClB,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,IAAI,WAAW,CAAC,KAAK,CAAC,CAClC,MAAM,CAAE,GAAG,CACX,IAAI,CAAE,GAAG,CACT,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IACR,CAEA,kBAAG,OAAQ,CACV,SAAS,CAAE,kCAAmB,CAAC,KAAK,CAAC,QAAQ,CAAC,QAAQ,CACtD,eAAe,CAAE,KAAK,CACtB,SAAS,CAAE,OAAO,KAAK,CACxB,CAEA,WAAW,8BAAgB,CAC1B,IAAK,CACJ,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACD,CAEA,WAAW,iCAAmB,CAC7B,IAAK,CACJ,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACV,CACD,CAEA,WAAW,kCAAoB,CAC9B,IAAK,CACJ,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACD"}`
};
const ErrorIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#ff4b4b" } = $$props;
  let { secondary = "#fff" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0) $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0) $$bindings.secondary(secondary);
  $$result.css.add(css$6);
  return `  <div class="svelte-1ee93ns"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$5 = {
  code: "div.svelte-1j7dflg{width:12px;height:12px;box-sizing:border-box;border:2px solid;border-radius:100%;border-color:var(--secondary, #e0e0e0);border-right-color:var(--primary, #616161);animation:svelte-1j7dflg-rotate 1s linear infinite}@keyframes svelte-1j7dflg-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: '{"version":3,"file":"LoaderIcon.svelte","sources":["LoaderIcon.svelte"],"sourcesContent":["<!-- Adapted from https://github.com/timolins/react-hot-toast -->\\n<script>export let primary = \\"#616161\\";\\nexport let secondary = \\"#e0e0e0\\";\\n<\/script>\\n\\n<div style:--primary={primary} style:--secondary={secondary} />\\n\\n<style>\\n\\tdiv {\\n\\t\\twidth: 12px;\\n\\t\\theight: 12px;\\n\\t\\tbox-sizing: border-box;\\n\\t\\tborder: 2px solid;\\n\\t\\tborder-radius: 100%;\\n\\t\\tborder-color: var(--secondary, #e0e0e0);\\n\\t\\tborder-right-color: var(--primary, #616161);\\n\\t\\tanimation: rotate 1s linear infinite;\\n\\t}\\n\\n\\t@keyframes rotate {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: rotate(0deg);\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: rotate(360deg);\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAQC,kBAAI,CACH,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,UAAU,CACtB,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,aAAa,CAAE,IAAI,CACnB,YAAY,CAAE,IAAI,WAAW,CAAC,QAAQ,CAAC,CACvC,kBAAkB,CAAE,IAAI,SAAS,CAAC,QAAQ,CAAC,CAC3C,SAAS,CAAE,qBAAM,CAAC,EAAE,CAAC,MAAM,CAAC,QAC7B,CAEA,WAAW,qBAAO,CACjB,IAAK,CACJ,SAAS,CAAE,OAAO,IAAI,CACvB,CACA,EAAG,CACF,SAAS,CAAE,OAAO,MAAM,CACzB,CACD"}'
};
const LoaderIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#616161" } = $$props;
  let { secondary = "#e0e0e0" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0) $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0) $$bindings.secondary(secondary);
  $$result.css.add(css$5);
  return `  <div class="svelte-1j7dflg"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$4 = {
  code: ".indicator.svelte-1kgeier{position:relative;display:flex;justify-content:center;align-items:center;min-width:20px;min-height:20px}.status.svelte-1kgeier{position:absolute}.animated.svelte-1kgeier{position:relative;transform:scale(0.6);opacity:0.4;min-width:20px;animation:svelte-1kgeier-enter 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards}@keyframes svelte-1kgeier-enter{from{transform:scale(0.6);opacity:0.4}to{transform:scale(1);opacity:1}}",
  map: `{"version":3,"file":"ToastIcon.svelte","sources":["ToastIcon.svelte"],"sourcesContent":["<script>import CheckmarkIcon from \\"./CheckmarkIcon.svelte\\";\\nimport ErrorIcon from \\"./ErrorIcon.svelte\\";\\nimport LoaderIcon from \\"./LoaderIcon.svelte\\";\\nexport let toast;\\n$:\\n  ({ type, icon, iconTheme } = toast);\\n<\/script>\\n\\n{#if typeof icon === 'string'}\\n\\t<div class=\\"animated\\">{icon}</div>\\n{:else if typeof icon !== 'undefined'}\\n\\t<svelte:component this={icon} />\\n{:else if type !== 'blank'}\\n\\t<div class=\\"indicator\\">\\n\\t\\t<LoaderIcon {...iconTheme} />\\n\\t\\t{#if type !== 'loading'}\\n\\t\\t\\t<div class=\\"status\\">\\n\\t\\t\\t\\t{#if type === 'error'}\\n\\t\\t\\t\\t\\t<ErrorIcon {...iconTheme} />\\n\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t<CheckmarkIcon {...iconTheme} />\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t.indicator {\\n\\t\\tposition: relative;\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\talign-items: center;\\n\\t\\tmin-width: 20px;\\n\\t\\tmin-height: 20px;\\n\\t}\\n\\n\\t.status {\\n\\t\\tposition: absolute;\\n\\t}\\n\\n\\t.animated {\\n\\t\\tposition: relative;\\n\\t\\ttransform: scale(0.6);\\n\\t\\topacity: 0.4;\\n\\t\\tmin-width: 20px;\\n\\t\\tanimation: enter 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;\\n\\t}\\n\\n\\t@keyframes enter {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0.6);\\n\\t\\t\\topacity: 0.4;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA4BC,yBAAW,CACV,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IACb,CAEA,sBAAQ,CACP,QAAQ,CAAE,QACX,CAEA,wBAAU,CACT,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,OAAO,CAAE,GAAG,CACZ,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,oBAAK,CAAC,IAAI,CAAC,KAAK,CAAC,aAAa,KAAK,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,QACrE,CAEA,WAAW,oBAAM,CAChB,IAAK,CACJ,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,OAAO,CAAE,GACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACV,CACD"}`
};
const ToastIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let type;
  let icon;
  let iconTheme;
  let { toast: toast2 } = $$props;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0) $$bindings.toast(toast2);
  $$result.css.add(css$4);
  ({ type, icon, iconTheme } = toast2);
  return `${typeof icon === "string" ? `<div class="animated svelte-1kgeier">${escape(icon)}</div>` : `${typeof icon !== "undefined" ? `${validate_component(icon || missing_component, "svelte:component").$$render($$result, {}, {}, {})}` : `${type !== "blank" ? `<div class="indicator svelte-1kgeier">${validate_component(LoaderIcon, "LoaderIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})} ${type !== "loading" ? `<div class="status svelte-1kgeier">${type === "error" ? `${validate_component(ErrorIcon, "ErrorIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})}` : `${validate_component(CheckmarkIcon, "CheckmarkIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})}`}</div>` : ``}</div>` : ``}`}`}`;
});
const css$3 = {
  code: ".message.svelte-1nauejd{display:flex;justify-content:center;margin:4px 10px;color:inherit;flex:1 1 auto;white-space:pre-line}",
  map: `{"version":3,"file":"ToastMessage.svelte","sources":["ToastMessage.svelte"],"sourcesContent":["<script>export let toast;\\n<\/script>\\n\\n<div class=\\"message\\" {...toast.ariaProps}>\\n\\t{#if typeof toast.message === 'string'}\\n\\t\\t{toast.message}\\n\\t{:else}\\n\\t\\t<svelte:component this={toast.message} {toast} />\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.message {\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\tmargin: 4px 10px;\\n\\t\\tcolor: inherit;\\n\\t\\tflex: 1 1 auto;\\n\\t\\twhite-space: pre-line;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAYC,uBAAS,CACR,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,MAAM,CAAE,GAAG,CAAC,IAAI,CAChB,KAAK,CAAE,OAAO,CACd,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CACd,WAAW,CAAE,QACd"}`
};
const ToastMessage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { toast: toast2 } = $$props;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0) $$bindings.toast(toast2);
  $$result.css.add(css$3);
  return `<div${spread([{ class: "message" }, escape_object(toast2.ariaProps)], { classes: "svelte-1nauejd" })}>${typeof toast2.message === "string" ? `${escape(toast2.message)}` : `${validate_component(toast2.message || missing_component, "svelte:component").$$render($$result, { toast: toast2 }, {}, {})}`} </div>`;
});
const css$2 = {
  code: "@keyframes svelte-ug60r4-enterAnimation{0%{transform:translate3d(0, calc(var(--factor) * -200%), 0) scale(0.6);opacity:0.5}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes svelte-ug60r4-exitAnimation{0%{transform:translate3d(0, 0, -1px) scale(1);opacity:1}100%{transform:translate3d(0, calc(var(--factor) * -150%), -1px) scale(0.6);opacity:0}}@keyframes svelte-ug60r4-fadeInAnimation{0%{opacity:0}100%{opacity:1}}@keyframes svelte-ug60r4-fadeOutAnimation{0%{opacity:1}100%{opacity:0}}.base.svelte-ug60r4{display:flex;align-items:center;background:#fff;color:#363636;line-height:1.3;will-change:transform;box-shadow:0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);max-width:350px;pointer-events:auto;padding:8px 10px;border-radius:8px}.transparent.svelte-ug60r4{opacity:0}.enter.svelte-ug60r4{animation:svelte-ug60r4-enterAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards}.exit.svelte-ug60r4{animation:svelte-ug60r4-exitAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards}.fadeIn.svelte-ug60r4{animation:svelte-ug60r4-fadeInAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards}.fadeOut.svelte-ug60r4{animation:svelte-ug60r4-fadeOutAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards}",
  map: `{"version":3,"file":"ToastBar.svelte","sources":["ToastBar.svelte"],"sourcesContent":["<script>import ToastIcon from \\"./ToastIcon.svelte\\";\\nimport { prefersReducedMotion } from \\"../core/utils\\";\\nimport ToastMessage from \\"./ToastMessage.svelte\\";\\nexport let toast;\\nexport let position = void 0;\\nexport let style = \\"\\";\\nexport let Component = void 0;\\nlet factor;\\nlet animation;\\n$: {\\n  const top = (toast.position || position || \\"top-center\\").includes(\\"top\\");\\n  factor = top ? 1 : -1;\\n  const [enter, exit] = prefersReducedMotion() ? [\\"fadeIn\\", \\"fadeOut\\"] : [\\"enter\\", \\"exit\\"];\\n  animation = toast.visible ? enter : exit;\\n}\\n<\/script>\\n\\n<div\\n\\tclass=\\"base {toast.height ? animation : 'transparent'} {toast.className || ''}\\"\\n\\tstyle=\\"{style}; {toast.style}\\"\\n\\tstyle:--factor={factor}\\n>\\n\\t{#if Component}\\n\\t\\t<svelte:component this={Component}>\\n\\t\\t\\t<ToastIcon {toast} slot=\\"icon\\" />\\n\\t\\t\\t<ToastMessage {toast} slot=\\"message\\" />\\n\\t\\t</svelte:component>\\n\\t{:else}\\n\\t\\t<slot {ToastIcon} {ToastMessage} {toast}>\\n\\t\\t\\t<ToastIcon {toast} />\\n\\t\\t\\t<ToastMessage {toast} />\\n\\t\\t</slot>\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t@keyframes enterAnimation {\\n\\t\\t0% {\\n\\t\\t\\ttransform: translate3d(0, calc(var(--factor) * -200%), 0) scale(0.6);\\n\\t\\t\\topacity: 0.5;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\ttransform: translate3d(0, 0, 0) scale(1);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes exitAnimation {\\n\\t\\t0% {\\n\\t\\t\\ttransform: translate3d(0, 0, -1px) scale(1);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\ttransform: translate3d(0, calc(var(--factor) * -150%), -1px) scale(0.6);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes fadeInAnimation {\\n\\t\\t0% {\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes fadeOutAnimation {\\n\\t\\t0% {\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t}\\n\\n\\t.base {\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tbackground: #fff;\\n\\t\\tcolor: #363636;\\n\\t\\tline-height: 1.3;\\n\\t\\twill-change: transform;\\n\\t\\tbox-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);\\n\\t\\tmax-width: 350px;\\n\\t\\tpointer-events: auto;\\n\\t\\tpadding: 8px 10px;\\n\\t\\tborder-radius: 8px;\\n\\t}\\n\\n\\t.transparent {\\n\\t\\topacity: 0;\\n\\t}\\n\\n\\t.enter {\\n\\t\\tanimation: enterAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;\\n\\t}\\n\\n\\t.exit {\\n\\t\\tanimation: exitAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;\\n\\t}\\n\\n\\t.fadeIn {\\n\\t\\tanimation: fadeInAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;\\n\\t}\\n\\n\\t.fadeOut {\\n\\t\\tanimation: fadeOutAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAoCC,WAAW,4BAAe,CACzB,EAAG,CACF,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,KAAK,IAAI,QAAQ,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,GAAG,CAAC,CACpE,OAAO,CAAE,GACV,CACA,IAAK,CACJ,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CACxC,OAAO,CAAE,CACV,CACD,CAEA,WAAW,2BAAc,CACxB,EAAG,CACF,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,CAAC,CAAC,CAC3C,OAAO,CAAE,CACV,CACA,IAAK,CACJ,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,KAAK,IAAI,QAAQ,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,CACvE,OAAO,CAAE,CACV,CACD,CAEA,WAAW,6BAAgB,CAC1B,EAAG,CACF,OAAO,CAAE,CACV,CACA,IAAK,CACJ,OAAO,CAAE,CACV,CACD,CAEA,WAAW,8BAAiB,CAC3B,EAAG,CACF,OAAO,CAAE,CACV,CACA,IAAK,CACJ,OAAO,CAAE,CACV,CACD,CAEA,mBAAM,CACL,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,OAAO,CACd,WAAW,CAAE,GAAG,CAChB,WAAW,CAAE,SAAS,CACtB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACxE,SAAS,CAAE,KAAK,CAChB,cAAc,CAAE,IAAI,CACpB,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,aAAa,CAAE,GAChB,CAEA,0BAAa,CACZ,OAAO,CAAE,CACV,CAEA,oBAAO,CACN,SAAS,CAAE,4BAAc,CAAC,KAAK,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,QACnE,CAEA,mBAAM,CACL,SAAS,CAAE,2BAAa,CAAC,IAAI,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,QACjE,CAEA,qBAAQ,CACP,SAAS,CAAE,6BAAe,CAAC,KAAK,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,QACpE,CAEA,sBAAS,CACR,SAAS,CAAE,8BAAgB,CAAC,IAAI,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,QACpE"}`
};
const ToastBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { toast: toast2 } = $$props;
  let { position = void 0 } = $$props;
  let { style = "" } = $$props;
  let { Component = void 0 } = $$props;
  let factor;
  let animation;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0) $$bindings.toast(toast2);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0) $$bindings.position(position);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
  if ($$props.Component === void 0 && $$bindings.Component && Component !== void 0) $$bindings.Component(Component);
  $$result.css.add(css$2);
  {
    {
      const top = (toast2.position || position || "top-center").includes("top");
      factor = top ? 1 : -1;
      const [enter, exit] = prefersReducedMotion() ? ["fadeIn", "fadeOut"] : ["enter", "exit"];
      animation = toast2.visible ? enter : exit;
    }
  }
  return `<div class="${"base " + escape(toast2.height ? animation : "transparent", true) + " " + escape(toast2.className || "", true) + " svelte-ug60r4"}"${add_styles(merge_ssr_styles(escape(style, true) + "; " + escape(toast2.style, true), { "--factor": factor }))}>${Component ? `${validate_component(Component || missing_component, "svelte:component").$$render($$result, {}, {}, {
    message: () => {
      return `${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2, slot: "message" }, {}, {})}`;
    },
    icon: () => {
      return `${validate_component(ToastIcon, "ToastIcon").$$render($$result, { toast: toast2, slot: "icon" }, {}, {})}`;
    }
  })}` : `${slots.default ? slots.default({ ToastIcon, ToastMessage, toast: toast2 }) : ` ${validate_component(ToastIcon, "ToastIcon").$$render($$result, { toast: toast2 }, {}, {})} ${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2 }, {}, {})} `}`} </div>`;
});
const css$1 = {
  code: ".wrapper.svelte-v01oml{left:0;right:0;display:flex;position:absolute;transform:translateY(calc(var(--offset, 16px) * var(--factor) * 1px))}.transition.svelte-v01oml{transition:all 230ms cubic-bezier(0.21, 1.02, 0.73, 1)}.active.svelte-v01oml{z-index:9999}.active.svelte-v01oml>*{pointer-events:auto}",
  map: `{"version":3,"file":"ToastWrapper.svelte","sources":["ToastWrapper.svelte"],"sourcesContent":["<script>import { onMount } from \\"svelte\\";\\nimport { prefersReducedMotion } from \\"../core/utils\\";\\nimport ToastBar from \\"./ToastBar.svelte\\";\\nimport ToastMessage from \\"./ToastMessage.svelte\\";\\nexport let toast;\\nexport let setHeight;\\nlet wrapperEl;\\nonMount(() => {\\n  setHeight(wrapperEl.getBoundingClientRect().height);\\n});\\n$:\\n  top = toast.position?.includes(\\"top\\") ? 0 : null;\\n$:\\n  bottom = toast.position?.includes(\\"bottom\\") ? 0 : null;\\n$:\\n  factor = toast.position?.includes(\\"top\\") ? 1 : -1;\\n$:\\n  justifyContent = toast.position?.includes(\\"center\\") && \\"center\\" || (toast.position?.includes(\\"right\\") || toast.position?.includes(\\"end\\")) && \\"flex-end\\" || null;\\n<\/script>\\n\\n<div\\n\\tbind:this={wrapperEl}\\n\\tclass=\\"wrapper\\"\\n\\tclass:active={toast.visible}\\n\\tclass:transition={!prefersReducedMotion()}\\n\\tstyle:--factor={factor}\\n\\tstyle:--offset={toast.offset}\\n\\tstyle:top\\n\\tstyle:bottom\\n\\tstyle:justify-content={justifyContent}\\n>\\n\\t{#if toast.type === 'custom'}\\n\\t\\t<ToastMessage {toast} />\\n\\t{:else}\\n\\t\\t<slot {toast}>\\n\\t\\t\\t<ToastBar {toast} position={toast.position} />\\n\\t\\t</slot>\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.wrapper {\\n\\t\\tleft: 0;\\n\\t\\tright: 0;\\n\\t\\tdisplay: flex;\\n\\t\\tposition: absolute;\\n\\t\\ttransform: translateY(calc(var(--offset, 16px) * var(--factor) * 1px));\\n\\t}\\n\\n\\t.transition {\\n\\t\\ttransition: all 230ms cubic-bezier(0.21, 1.02, 0.73, 1);\\n\\t}\\n\\n\\t.active {\\n\\t\\tz-index: 9999;\\n\\t}\\n\\n\\t.active > :global(*) {\\n\\t\\tpointer-events: auto;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAyCC,sBAAS,CACR,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,OAAO,CAAE,IAAI,CACb,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,WAAW,KAAK,IAAI,QAAQ,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,IAAI,QAAQ,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtE,CAEA,yBAAY,CACX,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CACvD,CAEA,qBAAQ,CACP,OAAO,CAAE,IACV,CAEA,qBAAO,CAAW,CAAG,CACpB,cAAc,CAAE,IACjB"}`
};
const ToastWrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let top;
  let bottom;
  let factor;
  let justifyContent;
  let { toast: toast2 } = $$props;
  let { setHeight } = $$props;
  let wrapperEl;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0) $$bindings.toast(toast2);
  if ($$props.setHeight === void 0 && $$bindings.setHeight && setHeight !== void 0) $$bindings.setHeight(setHeight);
  $$result.css.add(css$1);
  top = toast2.position?.includes("top") ? 0 : null;
  bottom = toast2.position?.includes("bottom") ? 0 : null;
  factor = toast2.position?.includes("top") ? 1 : -1;
  justifyContent = toast2.position?.includes("center") && "center" || (toast2.position?.includes("right") || toast2.position?.includes("end")) && "flex-end" || null;
  return `<div class="${[
    "wrapper svelte-v01oml",
    (toast2.visible ? "active" : "") + " " + (!prefersReducedMotion() ? "transition" : "")
  ].join(" ").trim()}"${add_styles({
    "--factor": factor,
    "--offset": toast2.offset,
    top,
    bottom,
    "justify-content": justifyContent
  })}${add_attribute("this", wrapperEl, 0)}>${toast2.type === "custom" ? `${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2 }, {}, {})}` : `${slots.default ? slots.default({ toast: toast2 }) : ` ${validate_component(ToastBar, "ToastBar").$$render($$result, { toast: toast2, position: toast2.position }, {}, {})} `}`} </div>`;
});
const css = {
  code: ".toaster.svelte-1phplh9{--default-offset:16px;position:fixed;z-index:9999;top:var(--default-offset);left:var(--default-offset);right:var(--default-offset);bottom:var(--default-offset);pointer-events:none}",
  map: `{"version":3,"file":"Toaster.svelte","sources":["Toaster.svelte"],"sourcesContent":["<script>import useToaster from \\"../core/use-toaster\\";\\nimport ToastWrapper from \\"./ToastWrapper.svelte\\";\\nexport let reverseOrder = false;\\nexport let position = \\"top-center\\";\\nexport let toastOptions = void 0;\\nexport let gutter = 8;\\nexport let containerStyle = void 0;\\nexport let containerClassName = void 0;\\nconst { toasts, handlers } = useToaster(toastOptions);\\nlet _toasts;\\n$:\\n  _toasts = $toasts.map((toast) => ({\\n    ...toast,\\n    position: toast.position || position,\\n    offset: handlers.calculateOffset(toast, $toasts, {\\n      reverseOrder,\\n      gutter,\\n      defaultPosition: position\\n    })\\n  }));\\n<\/script>\\n\\n<div\\n\\tclass=\\"toaster {containerClassName || ''}\\"\\n\\tstyle={containerStyle}\\n\\ton:mouseenter={handlers.startPause}\\n\\ton:mouseleave={handlers.endPause}\\n\\trole=\\"alert\\"\\n>\\n\\t{#each _toasts as toast (toast.id)}\\n\\t\\t<ToastWrapper {toast} setHeight={(height) => handlers.updateHeight(toast.id, height)} />\\n\\t{/each}\\n</div>\\n\\n<style>\\n\\t.toaster {\\n\\t\\t--default-offset: 16px;\\n\\n\\t\\tposition: fixed;\\n\\t\\tz-index: 9999;\\n\\t\\ttop: var(--default-offset);\\n\\t\\tleft: var(--default-offset);\\n\\t\\tright: var(--default-offset);\\n\\t\\tbottom: var(--default-offset);\\n\\t\\tpointer-events: none;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAmCC,uBAAS,CACR,gBAAgB,CAAE,IAAI,CAEtB,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,gBAAgB,CAAC,CAC1B,IAAI,CAAE,IAAI,gBAAgB,CAAC,CAC3B,KAAK,CAAE,IAAI,gBAAgB,CAAC,CAC5B,MAAM,CAAE,IAAI,gBAAgB,CAAC,CAC7B,cAAc,CAAE,IACjB"}`
};
const Toaster = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toasts, $$unsubscribe_toasts;
  let { reverseOrder = false } = $$props;
  let { position = "top-center" } = $$props;
  let { toastOptions = void 0 } = $$props;
  let { gutter = 8 } = $$props;
  let { containerStyle = void 0 } = $$props;
  let { containerClassName = void 0 } = $$props;
  const { toasts, handlers: handlers2 } = useToaster(toastOptions);
  $$unsubscribe_toasts = subscribe$1(toasts, (value) => $toasts = value);
  let _toasts;
  if ($$props.reverseOrder === void 0 && $$bindings.reverseOrder && reverseOrder !== void 0) $$bindings.reverseOrder(reverseOrder);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0) $$bindings.position(position);
  if ($$props.toastOptions === void 0 && $$bindings.toastOptions && toastOptions !== void 0) $$bindings.toastOptions(toastOptions);
  if ($$props.gutter === void 0 && $$bindings.gutter && gutter !== void 0) $$bindings.gutter(gutter);
  if ($$props.containerStyle === void 0 && $$bindings.containerStyle && containerStyle !== void 0) $$bindings.containerStyle(containerStyle);
  if ($$props.containerClassName === void 0 && $$bindings.containerClassName && containerClassName !== void 0) $$bindings.containerClassName(containerClassName);
  $$result.css.add(css);
  _toasts = $toasts.map((toast2) => ({
    ...toast2,
    position: toast2.position || position,
    offset: handlers2.calculateOffset(toast2, $toasts, {
      reverseOrder,
      gutter,
      defaultPosition: position
    })
  }));
  $$unsubscribe_toasts();
  return `<div class="${"toaster " + escape(containerClassName || "", true) + " svelte-1phplh9"}"${add_attribute("style", containerStyle, 0)} role="alert">${each(_toasts, (toast2) => {
    return `${validate_component(ToastWrapper, "ToastWrapper").$$render(
      $$result,
      {
        toast: toast2,
        setHeight: (height) => handlers2.updateHeight(toast2.id, height)
      },
      {},
      {}
    )}`;
  })} </div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let wallet2 = null;
  const injected = injectedModule();
  const onboard = init({
    wallets: [injected],
    chains: [
      {
        id: "0x171",
        token: "PLS",
        label: "PulseChain",
        rpcUrl: "https://rpc.pulsechain.com"
      }
    ],
    appMetadata: {
      name: "LEAN Farm",
      icon: "https://www.gopulsechain.com/files/LogoVector.svg",
      description: "LEAN Farming Interface"
    }
  });
  return `${validate_component(Toaster, "Toaster").$$render($$result, {}, {}, {})} ${validate_component(Navbar, "Navbar").$$render($$result, { wallet: wallet2, onboard }, {}, {})} <main class="min-h-screen py-8 px-4 md:px-8">${slots.default ? slots.default({}) : ``}</main>`;
});
export {
  BN_BOOST_RPC_URL as $,
  questionIcon as A,
  SuccessStatusIcon as B,
  stop_propagation as C,
  shortenDomain as D,
  unrecognizedChainStyle as E,
  run_all as F,
  create_out_transition as G,
  add_render_callback as H,
  create_in_transition as I,
  set_data as J,
  text as K,
  set_style as L,
  shortenAddress as M,
  BN_BOOST_INFO_URL as N,
  en as O,
  create_bidirectional_transition as P,
  quartOut as Q,
  fly as R,
  SvelteComponent as S,
  update_keyed_each as T,
  outro_and_destroy_block as U,
  toggle_class as V,
  WalletAppBadge as W,
  poweredByThirdweb as X,
  is_function as Y,
  disconnect as Z,
  updateChainRPC as _,
  append_styles as a,
  bubble as a0,
  fade as a1,
  binding_callbacks as a2,
  bind as a3,
  add_flush_callback as a4,
  wallets$ as a5,
  Modal as a6,
  setChain as a7,
  destroy_each as a8,
  setPrimaryWallet as a9,
  cubicOut as aA,
  create_animation as aB,
  $locale as aC,
  Layout as aD,
  selectAccounts as aa,
  connectWallet$ as ab,
  copyWalletAddress as ac,
  null_to_empty as ad,
  connectedToValidAppChain as ae,
  destroy_block as af,
  select_option as ag,
  chainIdToLabel as ah,
  handle_promise as ai,
  update_await_block_branch as aj,
  isSVG as ak,
  HtmlTag as al,
  src_url_equal as am,
  $format as an,
  fix_position as ao,
  add_transform as ap,
  chainStyles as aq,
  networkToChainId as ar,
  transactions$ as as,
  removeNotification as at,
  removeTransaction as au,
  addCustomNotification as av,
  gweiToWeiHex as aw,
  toHexString as ax,
  defaultNotifyEventStyles as ay,
  fix_and_outro_and_destroy_block as az,
  transition_in as b,
  check_outros as c,
  detach as d,
  insert as e,
  append as f,
  group_outros as g,
  element as h,
  init$1 as i,
  space as j,
  attr as k,
  listen as l,
  state as m,
  component_subscribe as n,
  onDestroy as o,
  destroy_component as p,
  mount_component as q,
  create_component as r,
  safe_not_equal as s,
  transition_out as t,
  updateAccountCenter as u,
  noop as v,
  empty as w,
  configuration as x,
  getDefaultChainStyles as y,
  connect$1 as z
};
