import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { TaskService } from '../services/task.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TaskItem } from '../models/task-item.model';
import { provideHttpClient } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let taskService: TaskService;

  // Mock task data
  const mockTasks: TaskItem[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      isCompleted: true,
      dueDate: '2023-12-31',
      status: 'Completed',
      createdAt: '2023-12-01',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      isCompleted: false,
      dueDate: '2023-12-31',
      status: 'In Progress',
      createdAt: '2023-12-02',
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description 3',
      isCompleted: false,
      dueDate: '2023-12-31',
      status: 'Pending',
      createdAt: '2023-12-03',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), TaskService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);

    // Mock the taskService
    spyOn(taskService, 'getTasks').and.returnValue(of(mockTasks));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load task statistics correctly', () => {
    expect(component.taskStats.total).toBe(3);
    expect(component.taskStats.completed).toBe(1);
    expect(component.taskStats.inProgress).toBe(1);
    expect(component.taskStats.pending).toBe(1);
    expect(component.taskStats.completionRate).toBe(33.33333333333333); // 1/3 * 100
  });

  it('should load recent tasks correctly', () => {
    expect(component.recentTasks.length).toBe(3);
    expect(component.recentTasks[0].id).toBe(3); // Most recent by createdAt
    expect(component.recentTasks[1].id).toBe(2);
    expect(component.recentTasks[2].id).toBe(1);
  });

  it('should return correct status colors', () => {
    expect(component.getStatusColor('Completed')).toBe('green');
    expect(component.getStatusColor('In Progress')).toBe('orange');
    expect(component.getStatusColor('Pending')).toBe('gray');
    expect(component.getStatusColor('Unknown')).toBe('black');
  });
});
