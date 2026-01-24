import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user = {
    name: 'Daloy Learner',
    email: 'learner@daloy.com',
    progress: 65
  };

  recentModules = [
    {
      title: 'Fundamentals of Cybersecurity',
      level: 'Beginner',
      duration: '4 hours',
      modules: 8,
      status: 'completed'
    },
    {
      title: 'Advanced Threat Detection',
      level: 'Advanced',
      duration: '6 hours',
      modules: 12,
      status: 'in-progress'
    }
  ];

  recentVideos = [
    {
      title: 'Understanding Network Attacks',
      duration: '12 mins',
      status: 'completed'
    },
    {
      title: 'Intro to Secure Authentication',
      duration: '9 mins',
      status: 'in-progress'
    }
  ];
}
