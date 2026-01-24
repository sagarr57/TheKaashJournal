import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { nicheData } from "@/lib/data";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ChartSection() {
  const top5Volume = [...nicheData.top_niches]
    .sort((a, b) => b.search_volume - a.search_volume)
    .slice(0, 5);

  const top5CPC = [...nicheData.top_niches]
    .sort((a, b) => b.cpc - a.cpc)
    .slice(0, 5);

  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
        <CardHeader className="border-b-2 border-black bg-secondary p-6">
          <CardTitle className="font-oswald text-2xl uppercase tracking-tight">
            Top 5 Niches by Search Volume
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5Volume} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    border: '2px solid black', 
                    borderRadius: '0px',
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                    fontFamily: 'Inter'
                  }}
                />
                <Bar dataKey="search_volume" radius={[0, 4, 4, 0]}>
                  {top5Volume.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="black" strokeWidth={2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
        <CardHeader className="border-b-2 border-black bg-secondary p-6">
          <CardTitle className="font-oswald text-2xl uppercase tracking-tight">
            Top 5 Niches by CPC ($)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5CPC} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    border: '2px solid black', 
                    borderRadius: '0px',
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                    fontFamily: 'Inter'
                  }}
                  formatter={(value) => [`$${value}`, 'CPC']}
                />
                <Bar dataKey="cpc" radius={[0, 4, 4, 0]}>
                  {top5CPC.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[(index + 2) % colors.length]} stroke="black" strokeWidth={2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
