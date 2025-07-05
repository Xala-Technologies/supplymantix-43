// Domain services for business logic orchestration
import { BaseRepository } from './base-repository';
import { WorkOrder } from '@/features/workOrders/types';
import { BaseEntity } from '@/types/common';

export interface DomainService<T extends BaseEntity> {
  validateBusinessRules(entity: T): Promise<ValidationResult>;
  executeWorkflow(id: string, action: string, params?: any): Promise<WorkflowResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  code: string;
  message: string;
}

export interface WorkflowResult {
  success: boolean;
  nextState?: string;
  actions?: WorkflowAction[];
  errors?: string[];
}

export interface WorkflowAction {
  type: string;
  description: string;
  required: boolean;
  dueDate?: string;
}

export abstract class BaseDomainService<T extends BaseEntity> implements DomainService<T> {
  constructor(protected repository: BaseRepository<T>) {}

  abstract validateBusinessRules(entity: T): Promise<ValidationResult>;
  abstract executeWorkflow(id: string, action: string, params?: any): Promise<WorkflowResult>;

  protected async applyBusinessRules(entity: T): Promise<T> {
    const validation = await this.validateBusinessRules(entity);
    
    if (!validation.isValid) {
      throw new Error(`Business rule validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    return entity;
  }

  protected async logDomainEvent(
    entityId: string, 
    eventType: string, 
    payload: any
  ): Promise<void> {
    // Domain event logging would be implemented here
    console.log(`Domain Event: ${eventType} for ${entityId}`, payload);
  }
}

// Work Order Domain Service
export class WorkOrderDomainService extends BaseDomainService<any> {
  async validateBusinessRules(workOrder: any): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Title validation
    if (!workOrder.title || workOrder.title.trim().length === 0) {
      errors.push({
        field: 'title',
        code: 'REQUIRED',
        message: 'Work order title is required',
        severity: 'error'
      });
    }

    // Priority and due date validation
    if (workOrder.priority === 'urgent' && !workOrder.due_date) {
      warnings.push({
        field: 'due_date',
        code: 'URGENT_NO_DUE_DATE',
        message: 'Urgent work orders should have a due date'
      });
    }

    // Status transition validation
    if (workOrder.status === 'completed' && !workOrder.completed_at) {
      errors.push({
        field: 'completed_at',
        code: 'COMPLETED_NO_TIMESTAMP',
        message: 'Completed work orders must have completion timestamp',
        severity: 'error'
      });
    }

    // Assignment validation
    if (workOrder.status === 'in_progress' && (!workOrder.assignedTo || workOrder.assignedTo.length === 0)) {
      errors.push({
        field: 'assignedTo',
        code: 'IN_PROGRESS_NO_ASSIGNEE',
        message: 'Work orders in progress must have assigned personnel',
        severity: 'error'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async executeWorkflow(id: string, action: string, params?: any): Promise<WorkflowResult> {
    const workOrderResult = await this.repository.findById(id);
    
    if (!workOrderResult.success || !workOrderResult.data) {
      return {
        success: false,
        errors: ['Work order not found']
      };
    }

    const workOrder = workOrderResult.data;

    switch (action) {
      case 'start':
        return this.startWorkOrder(workOrder);
      case 'complete':
        return this.completeWorkOrder(workOrder, params);
      case 'cancel':
        return this.cancelWorkOrder(workOrder, params);
      case 'assign':
        return this.assignWorkOrder(workOrder, params);
      default:
        return {
          success: false,
          errors: [`Unknown workflow action: ${action}`]
        };
    }
  }

  private async startWorkOrder(workOrder: any): Promise<WorkflowResult> {
    if (workOrder.status !== 'open') {
      return {
        success: false,
        errors: ['Only open work orders can be started']
      };
    }

    const updatedWorkOrder = {
      ...workOrder,
      status: 'in_progress' as const,
      started_at: new Date().toISOString()
    };

    const validation = await this.validateBusinessRules(updatedWorkOrder);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors.map(e => e.message)
      };
    }

    await this.repository.update(workOrder.id, {
      status: 'in_progress',
      started_at: new Date().toISOString()
    });

    await this.logDomainEvent(workOrder.id, 'WORK_ORDER_STARTED', {
      previousStatus: workOrder.status,
      newStatus: 'in_progress'
    });

    return {
      success: true,
      nextState: 'in_progress',
      actions: [
        {
          type: 'notification',
          description: 'Notify assignees that work has started',
          required: true
        }
      ]
    };
  }

  private async completeWorkOrder(workOrder: any, params?: any): Promise<WorkflowResult> {
    if (workOrder.status !== 'in_progress') {
      return {
        success: false,
        errors: ['Only work orders in progress can be completed']
      };
    }

    const updatedWorkOrder = {
      ...workOrder,
      status: 'completed' as const,
      completed_at: new Date().toISOString()
    };

    const validation = await this.validateBusinessRules(updatedWorkOrder);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors.map(e => e.message)
      };
    }

    await this.repository.update(workOrder.id, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    await this.logDomainEvent(workOrder.id, 'WORK_ORDER_COMPLETED', {
      previousStatus: workOrder.status,
      completionNotes: params?.notes
    });

    return {
      success: true,
      nextState: 'completed',
      actions: [
        {
          type: 'notification',
          description: 'Notify stakeholders of completion',
          required: true
        },
        {
          type: 'followup',
          description: 'Schedule follow-up inspection if required',
          required: false,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  private async cancelWorkOrder(workOrder: any, params?: any): Promise<WorkflowResult> {
    if (workOrder.status === 'completed' || workOrder.status === 'cancelled') {
      return {
        success: false,
        errors: ['Cannot cancel completed or already cancelled work orders']
      };
    }

    await this.repository.update(workOrder.id, {
      status: 'cancelled'
    });

    await this.logDomainEvent(workOrder.id, 'WORK_ORDER_CANCELLED', {
      previousStatus: workOrder.status,
      reason: params?.reason
    });

    return {
      success: true,
      nextState: 'cancelled'
    };
  }

  private async assignWorkOrder(workOrder: any, params?: any): Promise<WorkflowResult> {
    if (!params?.assignedTo) {
      return {
        success: false,
        errors: ['Assignee is required']
      };
    }

    await this.repository.update(workOrder.id, {
      assigned_to: params.assignedTo,
      assignedTo: [params.assignedTo]
    });

    await this.logDomainEvent(workOrder.id, 'WORK_ORDER_ASSIGNED', {
      assignedTo: params.assignedTo,
      assignedBy: params.assignedBy
    });

    return {
      success: true,
      actions: [
        {
          type: 'notification',
          description: 'Notify assignee of new work order',
          required: true
        }
      ]
    };
  }
}