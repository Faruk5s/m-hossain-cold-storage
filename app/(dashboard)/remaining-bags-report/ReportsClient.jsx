"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import axios from "axios";
import * as XLSX from "xlsx";

const formatBookingsForExcel = (data = []) => {
    return data.map((item, index) => ({
        "SL": index + 1,
        "Booking No": item.bookingNo,
        "Booking Holder name": item.bookingHolderName,
        "SR no": item.srNo,
        "SR holder name": item.srHolderName,
        "Potato name": item.potatoName,
        "Remaining Bags": item.remainingBags,
    }));
};

const ReportsClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "individual");
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [metadata, setMetadata] = useState(null);

    // Individual tab state
    const [searchBookingNo, setSearchBookingNo] = useState("");
    const [searchSrNo, setSearchSrNo] = useState("");

    // Custom tab state
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Update URL when tab changes
    useEffect(() => {
        router.push(`?tab=${activeTab}`, { scroll: false });
    }, [activeTab, router]);

    const fetchIndividualReport = async () => {
        
const token=localStorage.getItem('token');
        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stock-ins/remaining-bags`, {
                params: {
                    bookingNo: searchBookingNo,
                    srNo: searchSrNo,
                    
                },
                
                    headers:{
                        Authorization:token,
                    }
                
            });
            setReportData(response.data);
        } catch (error) {
            console.error("Error fetching report:", error);
            alert("Failed to fetch report. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    const fetchCustomReport = async () => {
        const token = localStorage.getItem('token'); 

        if (new Date(startDate) > new Date(endDate)) {
            alert("Start date must be before end date");
            return;
        }

        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings/custom-bookings-report`, {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                },
                headers: {
                    Authorization: token,
                }
            });
            setMetadata(response.data);
        } catch (error) {
            console.error("Error fetching report:", error);
            alert("Failed to fetch report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (!reportData.success) return;
        const excelData = formatBookingsForExcel(reportData.data);
        // Convert data to worksheet format
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `booking-report-${timestamp}.xlsx`;

        XLSX.writeFile(wb, filename);
    };
    const exportToExcelMeta = () => {
        if (!metadata.success) return;
        const excelData = ([metadata.data]);
        // Convert data to worksheet format
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `booking-report-meta-${timestamp}.xlsx`;

        XLSX.writeFile(wb, filename);
    };

    // const downloadPdf = async () => {
    //     try {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/export-booking-pdf`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 data: reportData.data,
    //             }),
    //         });

    //         if (!res.ok) {
    //             throw new Error('Server error');
    //         }

    //         const blob = await res.blob();

    //         // ✅ Validate PDF
    //         if (blob.type !== 'application/pdf') {
    //             throw new Error('Not a PDF file');
    //         }

    //         const url = window.URL.createObjectURL(blob);

    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'booking-report.pdf';
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();

    //         window.URL.revokeObjectURL(url);

    //     } catch (err) {
    //         console.error(err);
    //         alert('PDF download failed');
    //     }
    // };

    const totalRemainingBags=reportData?.data?.reduce((acc, item) => acc + (item.remainingBags || 0), 0) || 0;
  
    return (
        <div className="max-w-full">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Remaining Bags Report</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
                <button
                    onClick={() => setActiveTab("individual")}
                    className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === "individual"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-600 hover:text-slate-800"
                        }`}
                >
                    Individual Report
                </button>
                {/* <button
                    onClick={() => setActiveTab("custom")}
                    className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === "custom"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-600 hover:text-slate-800"
                        }`}
                >
                    Metadata Report
                </button> */}
            </div>

            {/* Individual Tab */}
            {activeTab === "individual" && (
                <>
                    <Card className="bg-teal-50">
                        <CardHeader>
                            <CardTitle>Individual Date Report</CardTitle>
                        </CardHeader>
                        <div className="p-6 space-y-4">
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Booking No
                                    </label>
                                    <input
                                        type="text"
                                        value={searchBookingNo}
                                        onChange={(e) => setSearchBookingNo(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        SR No
                                    </label>
                                    <input
                                        type="text"
                                        value={searchSrNo}
                                        onChange={(e) => setSearchSrNo(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                {/* <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Select Booking Type
                                    </label>
                                    <select value={bookingType} onChange={(e) => setBookingType(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value={'paid'}>Paid</option>
                                        <option value={'normal'}>Normal</option>
                                    </select>
                                </div> */}
                            </div>

                            <button
                                onClick={fetchIndividualReport}
                                disabled={loading}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition"
                            >
                                {loading ? "Loading..." : "Get Report"}
                            </button>
                        </div>
                    </Card>
                    {/* Report Data Display */}
                    {reportData?.success && (
                        <div className="mt-8">
                            <div className="flex gap-4 items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Report Results</h3>
                                <button
                                    onClick={exportToExcel}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Export to Excel
                                </button>
                                {/* <button
                                    onClick={downloadPdf}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                                >
                                    Download PDF (Fast)
                                </button> */}
                            </div>
                            <div className="bg-white my-4 border shadow rounded-md p-10 flex items-center justify-center w-fit">
                                <p className="font-medium  flex flex-col text-center"> <span className="font-semibold text-2xl">{totalRemainingBags}</span>Bags remaining</p>
                            </div>
                            <div className="bg-white rounded-lg  shadow max-w-7xl">
                                {/* scroll container */}
                                <div className=" overflow-x-auto ">
                                    <table className=" text-sm ">
                                        <thead className="sticky top-0 z-10 bg-slate-100">
                                            <tr className="border-b">
                                                
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">SL</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Booking No</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Booking Holder Name</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">SR No</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">SR Holder Name</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Potato Name</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">Remaining Bags</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y">
                                            {reportData?.data?.map((row, index) => (
                                                <tr key={index} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 text-slate-700 align-top">{index + 1}</td>
                                                    <td className="px-4 py-3 text-slate-700 align-top">{row?.bookingNo}</td>
                                                    <td className="px-4 py-3 text-slate-700 align-top">{row?.bookingHolderName}</td>
                                                    <td className="px-4 py-3 text-slate-700 align-top">{row?.srNo}</td>
                                                    <td className="px-4 py-3 text-slate-700 align-top">{row?.srHolderName}</td>
                                                    <td className="px-4 py-3 text-slate-700 align-top">{row?.potatoName}</td>
                                                    <td className="px-4 py-3 text-slate-700 align-top">{row?.remainingBags}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )}

            {/* Custom Tab */}
            {activeTab === "custom" && (
                <>
                    <Card className="bg-teal-50">
                        <CardHeader>
                            <CardTitle>Metadata Report</CardTitle>
                        </CardHeader>
                        <div className="p-6 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={fetchCustomReport}
                                disabled={loading}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition"
                            >
                                {loading ? "Loading..." : "Get Report"}
                            </button>
                        </div>
                    </Card>
                    {/* Report Data Display */}
                    {metadata?.success && (
                        <div className="mt-8">
                            <div className="flex gap-4 items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Report Results</h3>
                                <button
                                    onClick={exportToExcelMeta}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Export to Excel
                                </button>
                            </div>
                            <div className="bg-white rounded-lg shadow max-w-7xl">
                                {/* scroll container */}
                                <div className=" overflow-x-auto ">
                                    <table className=" text-sm ">
                                        <thead className="sticky top-0 z-10 bg-slate-100">
                                            <tr className="border-b">
                                                {metadata?.data &&
                                                    Object.keys(metadata?.data).map((key) => (
                                                        <th
                                                            key={key}
                                                            className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                                                        >
                                                            {key}
                                                        </th>
                                                    ))}
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y">

                                            <tr className="hover:bg-slate-50">
                                                {Object.entries(metadata.data).map(([k, value], i) => (
                                                    <td
                                                        key={`${k}-${i}`}
                                                        className="px-4 py-3 text-slate-700 align-top"
                                                    >
                                                        <div className="max-w-[260px] break-words">
                                                            {typeof value === "object" && value !== null
                                                                ? JSON.stringify(value)
                                                                : String(value ?? "")}
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )}

        </div>
)};

export default ReportsClient;