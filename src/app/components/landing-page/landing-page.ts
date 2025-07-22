// landing-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss']
})
export class LandingPageComponent implements OnInit {
  features = [
    {
      icon: '🎯',
      title: 'Task Management',
      description: 'Create, assign, and track tasks with comprehensive attributes including priorities, deadlines, and dependencies.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Real-time collaboration with shared projects, threaded comments, and instant notifications.'
    },
    {
      icon: '📊',
      title: 'Multiple Views',
      description: 'Switch between Kanban boards, list views, and calendar timelines to match your workflow preferences.'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Instant synchronization across all users with WebSocket technology for seamless collaboration.'
    },
    {
      icon: '🔒',
      title: 'Role-based Access',
      description: 'Secure access control with Admin, Manager, and Member roles ensuring data integrity.'
    },
    {
      icon: '📈',
      title: 'Analytics Dashboard',
      description: 'Powerful reporting and analytics to track progress, identify bottlenecks, and optimize productivity.'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Project Manager',
      company: 'TechCorp',
      avatar: 'SJ',
      content: 'This platform transformed how our team collaborates. The real-time updates and intuitive interface make project management effortless.'
    },
    {
      name: 'Michael Chen',
      role: 'Team Lead',
      company: 'StartupXYZ',
      avatar: 'MC',
      content: 'The multiple view options and drag-and-drop functionality have significantly improved our workflow efficiency.'
    },
    {
      name: 'Emma Davis',
      role: 'Scrum Master',
      company: 'DevAgency',
      avatar: 'ED',
      content: 'Role-based access control and comprehensive analytics give us the insights we need to deliver projects on time.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToAuth(page: string): void {
    this.router.navigate([`/auth/${page}`]);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}