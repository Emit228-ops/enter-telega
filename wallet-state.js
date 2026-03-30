/**
 * wallet-state.js — Единое хранилище балансов для Enter Change
 * Все страницы подключают этот файл для чтения/записи балансов через localStorage.
 */

const WalletState = (function () {
  const STORAGE_KEY = 'enterchange_wallets';

  // Метаданные всех 20 валют
  const COINS = {
    USDT:  { name: 'Tether',          color: '#26a17b', network: 'TRC-20',   decimals: 2 },
    BTC:   { name: 'Bitcoin',          color: '#f7931a', network: 'Bitcoin',   decimals: 8 },
    ETH:   { name: 'Ethereum',         color: '#627eea', network: 'ERC-20',   decimals: 6 },
    SOL:   { name: 'Solana',           color: '#00ffa3', network: 'Solana',    decimals: 4 },
    BNB:   { name: 'BNB',             color: '#f3ba2f', network: 'BEP-20',   decimals: 4 },
    XRP:   { name: 'XRP',             color: '#00aae4', network: 'XRP',       decimals: 2 },
    DOGE:  { name: 'Dogecoin',         color: '#c2a633', network: 'Dogecoin',  decimals: 2 },
    ADA:   { name: 'Cardano',          color: '#0033ad', network: 'Cardano',   decimals: 2 },
    DOT:   { name: 'Polkadot',         color: '#e6007a', network: 'Polkadot',  decimals: 4 },
    AVAX:  { name: 'Avalanche',        color: '#e84142', network: 'C-Chain',   decimals: 4 },
    MATIC: { name: 'Polygon',          color: '#8247e5', network: 'Polygon',   decimals: 2 },
    LINK:  { name: 'Chainlink',        color: '#2a5ada', network: 'ERC-20',   decimals: 4 },
    UNI:   { name: 'Uniswap',          color: '#ff007a', network: 'ERC-20',   decimals: 4 },
    ATOM:  { name: 'Cosmos',           color: '#2e3148', network: 'Cosmos',    decimals: 4 },
    FIL:   { name: 'Filecoin',         color: '#0090ff', network: 'Filecoin',  decimals: 4 },
    TRX:   { name: 'TRON',            color: '#ff0013', network: 'TRC-20',   decimals: 2 },
    LTC:   { name: 'Litecoin',         color: '#bfbbbb', network: 'Litecoin',  decimals: 6 },
    NEAR:  { name: 'NEAR Protocol',    color: '#00c08b', network: 'NEAR',      decimals: 4 },
    APT:   { name: 'Aptos',            color: '#4cd5c5', network: 'Aptos',     decimals: 4 },
    OP:    { name: 'Optimism',          color: '#ff0420', network: 'Optimism',  decimals: 4 }
  };

  // Демо-цены в USD
  const PRICES = {
    USDT: 1.00,
    BTC: 67234.50,
    ETH: 3456.78,
    SOL: 152.34,
    BNB: 587.45,
    XRP: 0.6234,
    DOGE: 0.1489,
    ADA: 0.4456,
    DOT: 7.82,
    AVAX: 38.95,
    MATIC: 0.8912,
    LINK: 14.23,
    UNI: 9.87,
    ATOM: 11.45,
    FIL: 6.78,
    TRX: 0.1234,
    LTC: 84.56,
    NEAR: 5.67,
    APT: 8.94,
    OP: 2.68
  };

  // Демо-балансы при первом запуске
  const DEFAULT_BALANCES = {
    USDT: 12450.00,
    BTC: 0.18560000,
    ETH: 2.456000,
    SOL: 45.3400,
    BNB: 3.2100,
    XRP: 1500.00,
    DOGE: 5000.00,
    ADA: 2200.00,
    DOT: 85.0000,
    AVAX: 22.5000,
    MATIC: 3400.00,
    LINK: 120.0000,
    UNI: 65.0000,
    ATOM: 42.0000,
    FIL: 30.0000,
    TRX: 8000.00,
    LTC: 4.500000,
    NEAR: 150.0000,
    APT: 0.0000,
    OP: 0.0000
  };

  // Фейковые адреса кошельков для депозита
  const DEPOSIT_ADDRESSES = {
    USDT: 'TN8sHKfQKxHxwv8FYAnpVq3GWxBqRfUkRm',
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    SOL: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
    BNB: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
    XRP: 'rN7JrMGiMHmFfgVPGsjxUMjMbhwn2mYdHZ',
    DOGE: 'DRSqEwcnJESiCG5vLFcDA3qnVG51nBd7Jv',
    ADA: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3n',
    DOT: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqWrztPu7CAkJVSKQeP',
    AVAX: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    MATIC: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    LINK: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    UNI: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    ATOM: 'cosmos1yl6hdjhmkf37639730gffanpzndzdpmhwlkfhr',
    FIL: 'f1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za',
    TRX: 'TN8sHKfQKxHxwv8FYAnpVq3GWxBqRfUkRm',
    LTC: 'ltc1qg42tkwuuxefutzxezdkdp39qqv8as7ledpnch4',
    NEAR: 'enterchange.near',
    APT: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    OP: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
  };

  function loadBalances() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function saveBalances(balances) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(balances));
  }

  function init() {
    if (!loadBalances()) {
      saveBalances({ ...DEFAULT_BALANCES });
    }
  }

  function getBalance(coin) {
    const balances = loadBalances() || DEFAULT_BALANCES;
    return balances[coin] || 0;
  }

  function setBalance(coin, amount) {
    const balances = loadBalances() || { ...DEFAULT_BALANCES };
    balances[coin] = amount;
    saveBalances(balances);
  }

  function addBalance(coin, amount) {
    const current = getBalance(coin);
    setBalance(coin, current + amount);
  }

  function subtractBalance(coin, amount) {
    const current = getBalance(coin);
    const newVal = Math.max(0, current - amount);
    setBalance(coin, newVal);
    return newVal;
  }

  function getAllBalances() {
    const balances = loadBalances() || { ...DEFAULT_BALANCES };
    const result = [];
    for (const [symbol, meta] of Object.entries(COINS)) {
      const balance = balances[symbol] || 0;
      const price = PRICES[symbol] || 0;
      result.push({
        symbol,
        name: meta.name,
        color: meta.color,
        network: meta.network,
        decimals: meta.decimals,
        balance,
        price,
        valueUSD: balance * price
      });
    }
    // Сортируем: сначала ненулевые по USD-стоимости, потом нулевые по алфавиту
    result.sort((a, b) => {
      if (a.valueUSD > 0 && b.valueUSD === 0) return -1;
      if (a.valueUSD === 0 && b.valueUSD > 0) return 1;
      if (a.valueUSD > 0 && b.valueUSD > 0) return b.valueUSD - a.valueUSD;
      return a.symbol.localeCompare(b.symbol);
    });
    return result;
  }

  function getTotalUSD() {
    const balances = loadBalances() || { ...DEFAULT_BALANCES };
    let total = 0;
    for (const [symbol, amount] of Object.entries(balances)) {
      total += amount * (PRICES[symbol] || 0);
    }
    return total;
  }

  function getPrice(coin) {
    return PRICES[coin] || 0;
  }

  function getCoinMeta(coin) {
    return COINS[coin] || null;
  }

  function getDepositAddress(coin) {
    return DEPOSIT_ADDRESSES[coin] || '';
  }

  function getAllCoins() {
    return Object.keys(COINS);
  }

  function formatBalance(coin, amount) {
    const meta = COINS[coin];
    if (!meta) return amount.toString();
    return amount.toFixed(meta.decimals);
  }

  function formatUSD(amount) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function resetToDefaults() {
    saveBalances({ ...DEFAULT_BALANCES });
  }

  // Автоинициализация
  init();

  return {
    getBalance,
    setBalance,
    addBalance,
    subtractBalance,
    getAllBalances,
    getTotalUSD,
    getPrice,
    getCoinMeta,
    getDepositAddress,
    getAllCoins,
    formatBalance,
    formatUSD,
    resetToDefaults,
    COINS,
    PRICES
  };
})();
