import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-view-course',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './view-course.html',
    styleUrl: './view-course.css'
})
export class ViewCourse {
    courses = [
        {
            id: 1,
            title: 'Introduction to Angular 17',
            author: 'John Doe',
            views: '12K views',
            time: '2 days ago',
            thumbnail: 'https://placehold.co/600x400/1877F2/FFFFFF?text=Angular+17',
            avatar: 'https://placehold.co/100x100/orange/white?text=JD'
        },
        {
            id: 2,
            title: 'Mastering TypeScript',
            author: 'Jane Smith',
            views: '8.5K views',
            time: '1 week ago',
            thumbnail: 'https://placehold.co/600x400/333333/FFFFFF?text=TypeScript',
            avatar: 'https://placehold.co/100x100/green/white?text=JS'
        },
        {
            id: 3,
            title: 'Web Design Fundamentals',
            author: 'Design Academy',
            views: '45K views',
            time: '3 weeks ago',
            thumbnail: 'https://placehold.co/600x400/purple/FFFFFF?text=Web+Design',
            avatar: 'https://placehold.co/100x100/purple/white?text=DA'
        },
        {
            id: 4,
            title: 'Advanced CSS Animations',
            author: 'Frontend Masters',
            views: '22K views',
            time: '1 month ago',
            thumbnail: 'https://placehold.co/600x400/pink/FFFFFF?text=CSS+Animations',
            avatar: 'https://placehold.co/100x100/pink/white?text=FM'
        },
        {
            id: 5,
            title: 'React vs Angular: The Guide',
            author: 'Tech Talk',
            views: '150K views',
            time: '2 months ago',
            thumbnail: 'https://placehold.co/600x400/red/FFFFFF?text=React+vs+Angular',
            avatar: 'https://placehold.co/100x100/red/white?text=TT'
        },
        {
            id: 6,
            title: 'Node.js Backend Development',
            author: 'Backend Pro',
            views: '5K views',
            time: '5 days ago',
            thumbnail: 'https://placehold.co/600x400/green/FFFFFF?text=Node.js',
            avatar: 'https://placehold.co/100x100/green/white?text=BP'
        }
    ];
}
