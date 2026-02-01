import { NewContact, NewLoan, NewTask } from "@/db/schema";

// Helper functions for relative dates
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(9, 0, 0, 0);
  return date;
}

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(9, 0, 0, 0);
  return date;
}

function today(): Date {
  const date = new Date();
  date.setHours(17, 0, 0, 0);
  return date;
}

export type DemoContactData = Omit<NewContact, "contactId" | "createdAt" | "updatedAt"> & {
  key: string;
};

export function getDemoContacts(userId: string): DemoContactData[] {
  return [
    {
      key: "sarah",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      address: "123 Oak Street",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      amount: "425000.00",
      status: "active",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    {
      key: "michael",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@email.com",
      phone: "(555) 234-5678",
      address: "456 Pine Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      amount: "550000.00",
      status: "active",
      loanType: "jumbo",
      isDemo: true,
      userId,
    },
    {
      key: "emily",
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "(555) 345-6789",
      address: "789 Maple Drive",
      city: "Denver",
      state: "CO",
      zipCode: "80202",
      amount: "320000.00",
      status: "active",
      loanType: "FHA",
      isDemo: true,
      userId,
    },
    {
      key: "david",
      firstName: "David",
      lastName: "Thompson",
      email: "david.thompson@email.com",
      phone: "(555) 456-7890",
      address: "321 Elm Court",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      amount: "275000.00",
      status: "inactive",
      loanType: "VA",
      isDemo: true,
      userId,
    },
    {
      key: "jennifer",
      firstName: "Jennifer",
      lastName: "Williams",
      email: "jennifer.williams@email.com",
      phone: "(555) 567-8901",
      address: "654 Cedar Lane",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      amount: "380000.00",
      status: "active",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    {
      key: "robert",
      firstName: "Robert",
      lastName: "Garcia",
      email: "robert.garcia@email.com",
      phone: "(555) 678-9012",
      address: "987 Birch Boulevard",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      amount: "495000.00",
      status: "active",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    {
      key: "amanda",
      firstName: "Amanda",
      lastName: "Martinez",
      email: "amanda.martinez@email.com",
      phone: "(555) 789-0123",
      address: "246 Willow Way",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      amount: "610000.00",
      status: "active",
      loanType: "jumbo",
      isDemo: true,
      userId,
    },
    {
      key: "christopher",
      firstName: "Christopher",
      lastName: "Lee",
      email: "christopher.lee@email.com",
      phone: "(555) 890-1234",
      address: "135 Spruce Street",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      amount: "725000.00",
      status: "active",
      loanType: "jumbo",
      isDemo: true,
      userId,
    },
    {
      key: "jessica",
      firstName: "Jessica",
      lastName: "Taylor",
      email: "jessica.taylor@email.com",
      phone: "(555) 901-2345",
      address: "864 Aspen Avenue",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      amount: "445000.00",
      status: "active",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    {
      key: "matthew",
      firstName: "Matthew",
      lastName: "Anderson",
      email: "matthew.anderson@email.com",
      phone: "(555) 012-3456",
      address: "753 Redwood Road",
      city: "Nashville",
      state: "TN",
      zipCode: "37201",
      amount: "355000.00",
      status: "inactive",
      loanType: "FHA",
      isDemo: true,
      userId,
    },
  ];
}

export type DemoLoanData = Omit<NewLoan, "id" | "createdAt" | "updatedAt"> & {
  contactKey: string;
};

export function getDemoLoans(
  userId: string,
  contactMap: Map<string, string>
): DemoLoanData[] {
  return [
    // Sarah - 3 loans (1 inactive)
    {
      contactKey: "sarah",
      contactId: contactMap.get("sarah")!,
      amount: "425000.00",
      status: "funded",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    {
      contactKey: "sarah",
      contactId: contactMap.get("sarah")!,
      amount: "185000.00",
      status: "closed",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    {
      contactKey: "sarah",
      contactId: contactMap.get("sarah")!,
      amount: "95000.00",
      status: "inactive",
      loanType: "HELOC",
      isDemo: true,
      userId,
    },
    // Michael - 1 loan
    {
      contactKey: "michael",
      contactId: contactMap.get("michael")!,
      amount: "550000.00",
      status: "approved",
      loanType: "jumbo",
      isDemo: true,
      userId,
    },
    // Emily - 1 loan
    {
      contactKey: "emily",
      contactId: contactMap.get("emily")!,
      amount: "320000.00",
      status: "pending",
      loanType: "FHA",
      isDemo: true,
      userId,
    },
    // David - 1 loan
    {
      contactKey: "david",
      contactId: contactMap.get("david")!,
      amount: "275000.00",
      status: "closed",
      loanType: "VA",
      isDemo: true,
      userId,
    },
    // Jennifer - 1 loan
    {
      contactKey: "jennifer",
      contactId: contactMap.get("jennifer")!,
      amount: "380000.00",
      status: "pending",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    // Robert - 3 loans (1 inactive)
    {
      contactKey: "robert",
      contactId: contactMap.get("robert")!,
      amount: "495000.00",
      status: "funded",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    {
      contactKey: "robert",
      contactId: contactMap.get("robert")!,
      amount: "220000.00",
      status: "closed",
      loanType: "FHA",
      isDemo: true,
      userId,
    },
    {
      contactKey: "robert",
      contactId: contactMap.get("robert")!,
      amount: "150000.00",
      status: "inactive",
      loanType: "investment",
      isDemo: true,
      userId,
    },
    // Amanda - 3 loans (1 inactive)
    {
      contactKey: "amanda",
      contactId: contactMap.get("amanda")!,
      amount: "610000.00",
      status: "approved",
      loanType: "jumbo",
      isDemo: true,
      userId,
    },
    {
      contactKey: "amanda",
      contactId: contactMap.get("amanda")!,
      amount: "340000.00",
      status: "funded",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    {
      contactKey: "amanda",
      contactId: contactMap.get("amanda")!,
      amount: "125000.00",
      status: "inactive",
      loanType: "HELOC",
      isDemo: true,
      userId,
    },
    // Christopher - 1 loan
    {
      contactKey: "christopher",
      contactId: contactMap.get("christopher")!,
      amount: "725000.00",
      status: "pending",
      loanType: "jumbo",
      isDemo: true,
      userId,
    },
    // Jessica - 1 loan
    {
      contactKey: "jessica",
      contactId: contactMap.get("jessica")!,
      amount: "445000.00",
      status: "approved",
      loanType: "conventional",
      isDemo: true,
      userId,
    },
    // Matthew - 1 loan
    {
      contactKey: "matthew",
      contactId: contactMap.get("matthew")!,
      amount: "355000.00",
      status: "closed",
      loanType: "FHA",
      isDemo: true,
      userId,
    },
  ];
}

export type DemoTaskData = Omit<NewTask, "id" | "createdAt">;

export function getDemoTasks(
  userId: string,
  contactMap: Map<string, string>,
  loanMap: Map<string, string>
): DemoTaskData[] {
  return [
    // Overdue tasks (3)
    {
      title: "Collect W-2 forms from Sarah",
      description: "Need W-2 forms from the last 2 years for income verification",
      dueDate: daysAgo(3),
      status: "pending",
      contactId: contactMap.get("sarah")!,
      loanId: loanMap.get("sarah"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    {
      title: "Follow up on appraisal for Michael",
      description: "Appraisal was ordered last week, need to check status",
      dueDate: daysAgo(1),
      status: "pending",
      contactId: contactMap.get("michael")!,
      loanId: loanMap.get("michael"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    {
      title: "Request updated bank statements from Robert",
      description: "Current statements are more than 60 days old",
      dueDate: daysAgo(2),
      status: "pending",
      contactId: contactMap.get("robert")!,
      loanId: loanMap.get("robert"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    // Due today (2)
    {
      title: "Submit Emily's loan application",
      description: "All documents collected, ready to submit to underwriting",
      dueDate: today(),
      status: "pending",
      contactId: contactMap.get("emily")!,
      loanId: loanMap.get("emily"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    {
      title: "Call Amanda about rate lock decision",
      description: "Rate lock expires tomorrow, need decision today",
      dueDate: today(),
      status: "pending",
      contactId: contactMap.get("amanda")!,
      loanId: loanMap.get("amanda"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    // Completed (2)
    {
      title: "Verify Emily's employment",
      description: "Call employer to verify current employment status",
      dueDate: daysAgo(2),
      status: "completed",
      contactId: contactMap.get("emily")!,
      loanId: loanMap.get("emily"),
      isDemo: true,
      userId,
      completedAt: daysAgo(2),
    },
    {
      title: "Order title search for Christopher",
      description: "Title company needs to begin search process",
      dueDate: daysAgo(4),
      status: "completed",
      contactId: contactMap.get("christopher")!,
      loanId: loanMap.get("christopher"),
      isDemo: true,
      userId,
      completedAt: daysAgo(3),
    },
    // Upcoming (5)
    {
      title: "Schedule closing for Sarah",
      description: "Coordinate with title company and set closing date",
      dueDate: daysFromNow(2),
      status: "pending",
      contactId: contactMap.get("sarah")!,
      loanId: loanMap.get("sarah"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    {
      title: "Review Jennifer's credit report",
      description: "Pull and review credit report for pre-approval",
      dueDate: daysFromNow(3),
      status: "pending",
      contactId: contactMap.get("jennifer")!,
      loanId: loanMap.get("jennifer"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    {
      title: "Send rate lock confirmation to Jennifer",
      description: "Lock in current rate and send confirmation email",
      dueDate: daysFromNow(5),
      status: "pending",
      contactId: contactMap.get("jennifer")!,
      loanId: loanMap.get("jennifer"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    {
      title: "Review Christopher's jumbo loan documents",
      description: "Additional asset documentation required for jumbo approval",
      dueDate: daysFromNow(4),
      status: "pending",
      contactId: contactMap.get("christopher")!,
      loanId: loanMap.get("christopher"),
      isDemo: true,
      userId,
      completedAt: null,
    },
    {
      title: "Send pre-approval letter to Jessica",
      description: "Generate and email pre-approval letter for house hunting",
      dueDate: daysFromNow(1),
      status: "pending",
      contactId: contactMap.get("jessica")!,
      loanId: loanMap.get("jessica"),
      isDemo: true,
      userId,
      completedAt: null,
    },
  ];
}
