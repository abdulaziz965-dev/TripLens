
import { Wallet, CheckCircle, ReceiptText } from "lucide-react";
import { auth } from "../../firebase/config";
import { T, display, body, heading, label } from "../theme";
import { SectionCard, BottomTabBar, AmountPill, Chip } from "../components/SharedComponents";
import { useExpenses } from "../hooks/useRealtime";

export function ExpensesScreen() {
  const { data: expenses } = useExpenses(auth.currentUser?.uid);
  
  const hasExpenses = expenses.length > 0;
  
  // Calculate total spend
  const totalSpendNumeric = expenses.reduce((acc, exp) => {
    // Basic parser for "₹X,XXX" format
    const val = parseInt(exp.amount.replace(/[₹,]/g, "")) || 0;
    return acc + val;
  }, 0);
  
  const totalSpend = `₹${totalSpendNumeric.toLocaleString()}`;

  const confirmedExpenses = expenses.filter(e => e.category === "Confirmed");
  const manualExpenses = expenses.filter(e => e.category === "Manual");

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", paddingBottom: 82 }}>
        <div style={{ background: `linear-gradient(160deg, ${T.navy} 0%, #1d3556 100%)`, paddingBottom: 22, borderRadius: "0 0 28px 28px", boxShadow: "0 8px 32px rgba(15,23,42,0.18)" }}>
          
          <div style={{ padding: "6px 20px 0" }}>
            <p style={{ ...body, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Expenses</p>
            <h1 style={{ ...display, fontSize: 28, color: "white", letterSpacing: -0.7, lineHeight: 1.1 }}>Track every rupee</h1>
            <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Separate confirmed costs from manual estimates.</p>
          </div>
        </div>

        <div style={{ padding: "18px 20px 0" }}>
          {hasExpenses ? (
            <SectionCard style={{ padding: 16, background: `linear-gradient(135deg, rgba(20,184,166,0.08), rgba(20,184,166,0.03))` }}>
              <p style={{ ...label, fontSize: 11, color: T.teal, marginBottom: 8 }}>Total Spend</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
                <div>
                  <p style={{ ...heading, fontSize: 22, color: T.navy, marginBottom: 4 }}>{totalSpend}</p>
                  <p style={{ ...body, fontSize: 12, color: T.slate, lineHeight: 1.5 }}>Combined confirmed and manual trip spend.</p>
                </div>
                <AmountPill value="All Trips" subtle />
              </div>
            </SectionCard>
          ) : null}
        </div>

        {!hasExpenses ? (
          <div style={{ padding: "18px 20px 0" }}>
            <SectionCard style={{ padding: 20, textAlign: "center" }}>
              <div style={{ width: 54, height: 54, borderRadius: 18, background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Wallet size={22} style={{ color: T.teal }} />
              </div>
              <p style={{ ...heading, fontSize: 20, color: T.navy, marginBottom: 6 }}>No expenses yet</p>
              <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.65 }}>Add bookings, food, transport, or manual estimates to start tracking your trip budget.</p>
            </SectionCard>
          </div>
        ) : (
          <>
            {confirmedExpenses.length > 0 && (
              <div style={{ padding: "18px 20px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <p style={{ ...heading, fontSize: 19, color: T.navy }}>Confirmed Expenses</p>
                    <p style={{ ...body, fontSize: 12, color: T.slateL, marginTop: 2 }}>Paid and verified costs</p>
                  </div>
                  <Chip color={T.green} bg="rgba(16,185,129,0.08)" border="rgba(16,185,129,0.2)">{confirmedExpenses.length}</Chip>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {confirmedExpenses.map(item => (
                    <SectionCard key={item.id} style={{ padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <p style={{ ...heading, fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 4 }}>{item.label}</p>
                          {/* We don't have trip names here yet, would need a join or pre-fetching */}
                          <p style={{ ...body, fontSize: 12, color: T.slate, lineHeight: 1.45 }}>Expense</p>
                        </div>
                        <AmountPill value={item.amount} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                        <CheckCircle size={14} color={T.green} />
                        <span style={{ ...body, fontWeight: 600, fontSize: 11, color: T.green }}>{item.category}</span>
                      </div>
                    </SectionCard>
                  ))}
                </div>
              </div>
            )}

            {manualExpenses.length > 0 && (
              <div style={{ padding: "18px 20px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <p style={{ ...heading, fontSize: 19, color: T.navy }}>Manual Expenses</p>
                    <p style={{ ...body, fontSize: 12, color: T.slateL, marginTop: 2 }}>Estimates and flexible budget items</p>
                  </div>
                  <Chip color={T.amber} bg="rgba(245,158,11,0.08)" border="rgba(245,158,11,0.2)">{manualExpenses.length}</Chip>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {manualExpenses.map(item => (
                    <SectionCard key={item.id} style={{ padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <p style={{ ...heading, fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 4 }}>{item.label}</p>
                          <p style={{ ...body, fontSize: 12, color: T.slate, lineHeight: 1.45 }}>Estimate</p>
                        </div>
                        <AmountPill value={item.amount} subtle />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                        <ReceiptText size={14} color={T.amber} />
                        <span style={{ ...body, fontWeight: 600, fontSize: 11, color: T.amber }}>{item.category}</span>
                      </div>
                    </SectionCard>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}
