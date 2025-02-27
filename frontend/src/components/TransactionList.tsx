"use client";

import { Table } from "antd";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(CategoryScale, LinearScale, BarElement, ChartDataLabels);


import { Transaction } from "@/hooks/useAgentworkflow";

export default function TransactionsPage({ transactions, categories }: { transactions: Transaction[], categories: string[] }) {

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 150,
            sorter: (a: Transaction, b: Transaction) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: "Payee",
            dataIndex: "payee",
            key: "payee",
            width: 300,
        },
        {
            title: "From account",
            dataIndex: "from_account",
            key: "from_account",
            width: 300,
        },
        {
            title: "To account",
            dataIndex: "to_account",
            key: "to_account",
            width: 300,
        },
        {
            title: "Amount",
            dataIndex: "display_amount",
            key: "display_amount",
            width: 300,
        },
    ];

    const getTotalByCategory = (transactions: Transaction[]) => {
        const totals: { [key: string]: number } = {};
        categories.forEach(category => {
            totals[category] = 0;
        });

        transactions.forEach(transaction => {
            if (totals.hasOwnProperty(transaction.to_account)) {
                totals[transaction.to_account] += parseFloat(transaction.amount);
            }
        });

        return totals;
    };
    const totals = getTotalByCategory(transactions);
    const chart_data = {
        labels: categories.map(category => category.replace("Expenses:", "")),
        datasets: [
            {
                label: 'Total Value',
                data: categories.map(category => totals[category]),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };
    const chart_options = {
        responsive: true,
        plugins: {
            datalabels: {
                anchor: "end" as const,
                align: "end" as const,
                formatter: (value: number) => `$${value.toFixed(2)}`,
                font: {
                    size: 11,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grace: '7%',
                ticks: {
                    callback: function (tickValue: number | string) {
                        return `$${tickValue}`;
                    },
                },
            },
        },
    };

    return (
        <div className="p-4">
            <div className="flex">
                <div className="w-7/12 p-4">
                    <h1 className="text-xl font-bold mb-4 p-3">Transactions</h1>
                    <Table
                        dataSource={transactions}
                        columns={columns}
                        rowKey="id"
                        pagination={{ defaultPageSize: 10 }}
                        size="middle"
                        scroll={{ x: true }}
                    />
                </div>
                <div className="w-5/12 p-4">
                    <h2 className="text-xl font-bold mb-4 p-3">Expenses by Category</h2>
                    <Bar data={chart_data} options={chart_options} className="pt-5" />
                </div>
            </div>
        </div>
    );
}
