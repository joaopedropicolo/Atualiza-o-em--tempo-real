import { useState, useEffect } from 'react';
import useSWR from 'swr';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetcher } from '../lib/fetcher';

export default function Cotacao() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (startDate && endDate) {
      const format = (date) =>
        date.toISOString().slice(0, 10).replace(/-/g, '');
      const start = format(startDate);
      const end = format(endDate);
      setUrl(
        `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${start}&end_date=${end}`
      );
    }
  }, [startDate, endDate]);

  const { data, error, isLoading } = useSWR(url, fetcher);

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Cotação USD/BRL</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>Início: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="Dia/Mês/Ano"
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Fim: </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="Dia/Mês/Ano"
        />
      </div>

      {!startDate || !endDate ? (
        <p>Selecione as duas datas para buscar cotações.</p>
      ) : isLoading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>Erro ao carregar dados.</p>
      ) : data ? (
        <table border="1" cellPadding="10" style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Compra</th>
              <th>Venda</th>
              <th>Alta</th>
              <th>Baixa</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.timestamp}>
                <td>{new Date(item.timestamp * 1000).toLocaleDateString()}</td>
                <td>R$ {item.bid}</td>
                <td>R$ {item.ask}</td>
                <td>R$ {item.high}</td>
                <td>R$ {item.low}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </main>
  );
}