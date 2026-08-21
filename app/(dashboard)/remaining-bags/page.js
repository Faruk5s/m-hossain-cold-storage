"use client";

import { useEffect, useState } from "react";
export default function RemainingBags() {
  const [remainingBags, setRemainingBags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock-ins/remaining-bags`)
      .then((res) => res.json())
      .then((data) => {
        setRemainingBags(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);



  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800">Remaining Bags</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">SL</th>
              <th className="p-3 text-left">SR No</th>
              <th className="p-3 text-center">Potato Name</th>
              <th className="p-3 text-center">SR Holder Name</th>
              <th className="p-3 text-center">Remaining Bags</th>
             
            </tr>
          </thead>

          <tbody>
            {remainingBags.map((item, index) => (
              <tr
                key={item._id}
                className="border-b text-zinc-500 hover:bg-slate-50"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{item.srNo}</td>
                <td className="p-3 text-center">{item.potatoName}</td>
                <td className="p-3 text-center">{item.srHolderName}</td>
                <td className="p-3 text-center">{item.remainingBags}</td>
                
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
