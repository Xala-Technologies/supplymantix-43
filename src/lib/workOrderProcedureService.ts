
// Service to handle the relationship between work orders and procedures
export interface ProcedureStep {
  id: string;
  title: string;
  description: string;
  type: 'checkbox' | 'text' | 'number' | 'select' | 'file';
  required: boolean;
  options?: string[];
  completed?: boolean;
  value?: string | number | boolean;
}

export interface Procedure {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedDuration: number; // minutes
  requiredSkills: string[];
  safetyRequirements: string[];
  tools: string[];
  steps: ProcedureStep[];
}

export interface WorkOrderProcedureLink {
  workOrderId: string;
  procedureId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  completionData?: Record<string, any>;
}

// Sample procedures that would typically be linked to work orders
export const sampleProcedures: Procedure[] = [
  {
    id: 'proc-001',
    title: 'Wrapper Equipment Malfunction Response',
    category: 'Reactive Maintenance',
    description: 'Standard procedure for diagnosing and resolving wrapper equipment malfunctions',
    estimatedDuration: 45,
    requiredSkills: ['Mechanical Maintenance', 'Electrical Troubleshooting'],
    safetyRequirements: ['LOTO', 'PPE Required', 'Confined Space Awareness'],
    tools: ['Multimeter', 'Basic Hand Tools', 'Torque Wrench'],
    steps: [
      {
        id: 'step-001',
        title: 'Safety Lockout/Tagout',
        description: 'Apply LOTO procedures before beginning work',
        type: 'checkbox',
        required: true
      },
      {
        id: 'step-002',
        title: 'Visual Inspection',
        description: 'Inspect wrapper for obvious damage, loose connections, or obstructions',
        type: 'text',
        required: true
      },
      {
        id: 'step-003',
        title: 'Check Belt Tension',
        description: 'Verify belt tension is within specification (80-100 lbs)',
        type: 'number',
        required: true
      },
      {
        id: 'step-004',
        title: 'Electrical Connections Check',
        description: 'Verify all electrical connections are secure and properly terminated',
        type: 'checkbox',
        required: true
      }
    ]
  },
  {
    id: 'proc-002',
    title: 'Daily Site Safety Walk Inspection',
    category: 'Safety',
    description: 'OSHA compliance daily safety inspection procedure',
    estimatedDuration: 30,
    requiredSkills: ['Safety Inspection', 'OSHA Compliance'],
    safetyRequirements: ['Safety Vest', 'Hard Hat'],
    tools: ['Inspection Checklist', 'Camera/Phone', 'Measuring Tape'],
    steps: [
      {
        id: 'step-101',
        title: 'Emergency Exit Verification',
        description: 'Verify all emergency exits are clear and properly marked',
        type: 'checkbox',
        required: true
      },
      {
        id: 'step-102',
        title: 'Fire Extinguisher Check',
        description: 'Confirm fire extinguishers are in place and properly charged',
        type: 'checkbox',
        required: true
      },
      {
        id: 'step-103',
        title: 'Hazard Identification',
        description: 'Document any new or existing hazards',
        type: 'text',
        required: false
      }
    ]
  },
  {
    id: 'proc-003',
    title: 'Wrapper Preventive Cleaning',
    category: 'Inspection',
    description: 'Regular cleaning and maintenance procedure for wrapper equipment',
    estimatedDuration: 60,
    requiredSkills: ['Equipment Cleaning', 'Basic Maintenance'],
    safetyRequirements: ['LOTO', 'Chemical Safety'],
    tools: ['Cleaning Supplies', 'Brushes', 'Compressed Air'],
    steps: [
      {
        id: 'step-201',
        title: 'Equipment Shutdown',
        description: 'Properly shut down and isolate wrapper equipment',
        type: 'checkbox',
        required: true
      },
      {
        id: 'step-202',
        title: 'Remove Debris',
        description: 'Clear all packaging materials and debris from wrapper',
        type: 'checkbox',
        required: true
      },
      {
        id: 'step-203',
        title: 'Clean Cutting Assembly',
        description: 'Clean and inspect cutting assembly for wear or damage',
        type: 'text',
        required: true
      }
    ]
  }
];

// Service functions to manage work order-procedure relationships
export const workOrderProcedureService = {
  // Get recommended procedures for a work order based on its characteristics
  getRecommendedProcedures(workOrder: any): Procedure[] {
    const recommendations: Procedure[] = [];
    
    // Logic based on work order type and asset
    if (workOrder.title.toLowerCase().includes('wrapper') && workOrder.title.toLowerCase().includes('malfunction')) {
      recommendations.push(sampleProcedures.find(p => p.id === 'proc-001')!);
    }
    
    if (workOrder.category === 'Safety' || workOrder.title.toLowerCase().includes('safety')) {
      recommendations.push(sampleProcedures.find(p => p.id === 'proc-002')!);
    }
    
    if (workOrder.title.toLowerCase().includes('cleaning') || workOrder.title.toLowerCase().includes('inspection')) {
      recommendations.push(sampleProcedures.find(p => p.id === 'proc-003')!);
    }
    
    return recommendations.filter(Boolean);
  },

  // Get linked procedures for a work order
  getLinkedProcedures(workOrderId: string): WorkOrderProcedureLink[] {
    // This would typically come from a database
    // For demo purposes, return some sample links
    if (workOrderId === '5969') {
      return [
        {
          workOrderId: '5969',
          procedureId: 'proc-001',
          status: 'in_progress',
          assignedTo: 'Zach Brown',
          startedAt: '2023-10-05T09:00:00Z'
        }
      ];
    }
    
    if (workOrderId === '5962') {
      return [
        {
          workOrderId: '5962',
          procedureId: 'proc-002',
          status: 'not_started',
          assignedTo: 'Safety Team'
        }
      ];
    }
    
    return [];
  },

  // Link a procedure to a work order
  linkProcedure(workOrderId: string, procedureId: string): WorkOrderProcedureLink {
    return {
      workOrderId,
      procedureId,
      status: 'not_started'
    };
  },

  // Update procedure status
  updateProcedureStatus(link: WorkOrderProcedureLink, status: WorkOrderProcedureLink['status']) {
    return {
      ...link,
      status,
      ...(status === 'in_progress' && !link.startedAt ? { startedAt: new Date().toISOString() } : {}),
      ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
    };
  }
};
