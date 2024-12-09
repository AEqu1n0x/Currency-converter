import { useState, useEffect } from "react";
import styles from "./currencyConverter.module.css";
import { currencies } from "../../assets/currencies";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("CNY");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [date, setDate] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getExchangeRate = async () => {
      const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
      const data = await response.json();
      if (isMounted) {
        const currency = data.Valute[fromCurrency];
        setExchangeRate(currency ? currency.Value : 1);
        setDate(formatDate(data.Timestamp));
      }
    };
    getExchangeRate();

    return () => {
      isMounted = false;
    };
  }, [fromCurrency]);

  const getCurrencyName = (currencyCode) => {
    const currency = currencies.find((curr) => curr.code === currencyCode);
    return currency ? currency.name : "";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = date.toLocaleString("ru-RU", { ...options, timeZone: "Europe/Moscow" });
    return formattedDate + " (мск)";
  };

  return (
    <div className={styles.converter}>
      <h1>Конвертер валют</h1>
      <div className={styles.converter_inputGroup}>
        <input
          className={styles.converter_input}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className={styles.converter_select}
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} {currency.symbol}
            </option>
          ))}
        </select>
      </div>
      <p className={styles.converter_rate}>Курс: {exchangeRate.toFixed(4)} ₽</p>
      <p className={styles.converter_rate}>
        {amount} {fromCurrency} ({getCurrencyName(fromCurrency)}) =
      </p>

      <p className={styles.converter_rate}> {(amount * exchangeRate).toFixed(2)} ₽</p>
      <p className={styles.converter_rate}>Данные актуальны на: </p>
      <p className={styles.converter_rate}>{date}</p>
    </div>
  );
};

export default CurrencyConverter;
