"use client";

import { useState } from "react";
import { Calculator, Wallet, Calendar, Percent, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function PaymentCalculator() {
    const [price, setPrice] = useState(50000);
    const [downPayment, setDownPayment] = useState(10000);
    const [term, setTerm] = useState(60);
    const [rate, setRate] = useState(2.88);
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
    const [amortizationSchedule, setAmortizationSchedule] = useState<{ month: number; interest: number; capital: number; balance: number }[]>([]);

    const calculatePayment = () => {
        const principal = price - downPayment;
        const monthlyRate = (rate / 100) / 12;
        const numberOfPayments = term;

        let payment = 0;
        if (monthlyRate === 0) {
            payment = principal / numberOfPayments;
        } else {
            payment =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        }

        setMonthlyPayment(payment);

        // Calculate amortization schedule
        let balance = principal;
        const schedule = [];
        for (let i = 1; i <= numberOfPayments; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = payment - interestPayment;
            balance -= principalPayment;

            // Adjust for last payment rounding if needed (though keeping it simple for chart is usually fine)
            if (balance < 0) balance = 0;

            schedule.push({
                month: i,
                interest: Math.round(interestPayment),
                capital: Math.round(principalPayment),
                balance: Math.round(balance)
            });
        }
        setAmortizationSchedule(schedule);
    };

    return (
        <Card className="border-none bg-card/30 backdrop-blur-md overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-8 pb-0">
                <CardTitle className="flex items-center gap-3 font-heading text-2xl text-white uppercase tracking-wide">
                    <Calculator className="h-6 w-6 text-primary" />
                    Payment Estimator
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-gray-200 uppercase text-xs tracking-wider">Vehicle Price ($)</Label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                                id="price"
                                type="text"
                                inputMode="numeric"
                                value={price.toLocaleString()}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/,/g, '');
                                    if (value === '' || !isNaN(Number(value))) {
                                        setPrice(Number(value));
                                    }
                                }}
                                className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="down" className="text-gray-200 uppercase text-xs tracking-wider">Down Payment ($)</Label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                                id="down"
                                type="text"
                                inputMode="numeric"
                                value={downPayment.toLocaleString()}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/,/g, '');
                                    if (value === '' || !isNaN(Number(value))) {
                                        setDownPayment(Number(value));
                                    }
                                }}
                                className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="term" className="text-gray-200 uppercase text-xs tracking-wider">Term (Months)</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="term"
                                    type="number"
                                    value={term}
                                    onChange={(e) => setTerm(Number(e.target.value))}
                                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rate" className="text-gray-200 uppercase text-xs tracking-wider">Interest Rate (%)</Label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="rate"
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={calculatePayment}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wider uppercase py-6"
                >
                    Calculate Monthly Payment
                </Button>

                {monthlyPayment !== null && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-6 bg-white/5 rounded-sm border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300 uppercase tracking-wider text-sm font-bold">Monthly Payment</span>
                                <span className="text-4xl font-heading font-bold text-white">
                                    ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 text-right">
                                *Estimated payment for illustration purposes only.
                            </p>
                        </div>

                        <div className="h-[200px] w-full">
                            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Payment Breakdown</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={amortizationSchedule}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#fca5a5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="month"
                                        type="number"
                                        domain={[0, term]}
                                        ticks={Array.from({ length: Math.ceil(term / 12) }, (_, i) => (i + 1) * 12).filter(t => t <= term)}
                                        stroke="#a1a1aa"
                                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                        tickLine={{ stroke: '#3f3f46' }}
                                        label={{ value: 'Months', position: 'insideBottomRight', offset: -5, fill: '#a1a1aa', fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="#a1a1aa"
                                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                        tickLine={{ stroke: '#3f3f46' }}
                                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                                        width={60}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '4px' }}
                                        itemStyle={{ color: '#e4e4e7' }}
                                        labelStyle={{ color: '#a1a1aa' }}
                                        formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area
                                        type="monotone"
                                        dataKey="capital"
                                        stackId="1"
                                        stroke="#ef4444"
                                        fill="url(#colorCapital)"
                                        name="Capital"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="interest"
                                        stackId="1"
                                        stroke="#fca5a5"
                                        fill="url(#colorInterest)"
                                        name="Interest"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
