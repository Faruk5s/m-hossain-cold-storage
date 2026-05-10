"use client";

import { use, useEffect, useState } from "react";
import formatGlobalDate from "../../../../lib/formatGlobalDate";

export default function ViewStockOut({ params }) {
  const [stockOut, setStockOut] = useState(null);
  const [srHolderName, setSrHolderName] = useState('');
  const { id } = use(params);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock-outs/${id}`)
      .then((res) => res.json())
      .then((data) =>{ setStockOut(data.data.result);
      setSrHolderName(data.data.srHolderName)
    });
  }, [id]);

  if (!stockOut) return <p>Loading...</p>;
console.log(stockOut)
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Stock OUT Details</h2>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <Field label="SR No" value={stockOut.srNo} />
        <Field label="Booking No" value={stockOut.bookingNo} />
        <Field label="Do No" value={stockOut.doNo} />
        <Field label="Customer Name" value={stockOut?.bookingId?.customerName} />
        <Field label="SR Holder Name" value={srHolderName} />
        <Field label="Bags OUT" value={stockOut.bagsOut} />
        <Field label="Rate" value={`৳${stockOut.bookingId.rate}`} />
        <Field label="Total Amount" value={`৳${Number(stockOut.bookingId.rate)* Number(stockOut.bagsOut) }`} />
        <Field label="Stock OUT Date" value={formatGlobalDate(stockOut.date) } />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-black">{value}</p>
    </div>
  );
}
