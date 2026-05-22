import sys

with open("src/app/pages/Dashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ("Authorization: Bearer ${token}", "Authorization: `Bearer ${token}`"),
    ("Fetching dashboard data for ${user.role} from ${endpoint}", "`Fetching dashboard data for ${user.role} from ${endpoint}`"),
    ("value: $${dashboardStats.revenue.value.toLocaleString()}", "value: `$${dashboardStats.revenue.value.toLocaleString()}`"),
    ("className={p-3 rounded-xl ${stat.bgColor} ${stat.color}}", "className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}"),
    ('className={text-xs font-semibold px-2 py-1 rounded-full ${stat.trend==="up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600" }}', 'className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend==="up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}'),
    ("key={cell-${index}}", "key={`cell-${index}`}"),
    ("className={text-[10px] font-bold ${percentage>= 100 ? 'text-green-600' : 'text-indigo-600'}}", "className={`text-[10px] font-bold ${percentage>= 100 ? 'text-green-600' : 'text-indigo-600'}`}"),
    ("className={h-full rounded-full transition-all duration-1000 ${percentage>= 100 ? 'bg-green-500' : 'bg-indigo-600'}}", "className={`h-full rounded-full transition-all duration-1000 ${percentage>= 100 ? 'bg-green-500' : 'bg-indigo-600'}`}"),
    ("style={{ width: ${Math.min(percentage, 100)}% }}", "style={{ width: `${Math.min(percentage, 100)}%` }}"),
    ("src={https://ui-avatars.com/api/?name=${topPerformer.name || 'User' }&background=random}", "src={`https://ui-avatars.com/api/?name=${topPerformer.name || 'User' }&background=random`}")
]

for old, new_str in replacements:
    content = content.replace(old, new_str)

with open("src/app/pages/Dashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done fixing backticks.")
