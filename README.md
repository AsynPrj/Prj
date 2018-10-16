# Hexo Dashboard
project for Event-drive Asynchronous Programming

### Members
 - [YolandaW](https://github.com/YolandaWEI) 
 - [captainneko](https://github.com/captainneko)
 - [PrincQiWang](https://github.com/PrinceQiWang)
 
### Development Environment
 - Node.js 10.11.0
 
<!-- more -->

## Analyse

1. examine the subject in detail

​	We want to build a Hexo web dashboard which is used for manage Hexo Blog. 

​	Hexo is a static blog which is based on Node.js to rendering md file fo html. Connect with Git-page, we could easy deploy our personal blog. But there is no back-end or admin management system to use GUI manage blog page. Each post article need to be rendered in terminal by command 'hexo g'. So we want to build a repo for Hexo to use GUI manage the blog pages.

2. identify the main problem (the goal)

​	There already exist two Git repos about Hexo-admin while they are too difficult to use. We analysed their structures and decided to use our own designed structure but we weill reference their codes.

​        Hexo use twice renderings and the first time is to render `post` (which is a md file) to `article` which is a kind of yml style and the second rendering is transfer `article` by the yml css style into html.

Our Main goal is to manage ( to add, delete, deploy, search article page and etc ).

3. break it down into sub-problems (sub-goals)

Our sub-goal is to edit md file, and  render the page to html on real-time.

- classify articles and organized them
- use GUI to DIY models on Home Page and Article Page
- develop a GUI page to make own css style pages.
- use dynamic third-part plugins to manage comments.

4. with the help of information reserach

[HEXO Official Docs](https://hexo.io/api/index.html)

[HEXO admin repo](https://github.com/jaredly/hexo-admin)

5. as issues emerge

We need to spent a lot of time reading HEXO API documents.

## Design

1. develop solutions for some sub-problems
2. Synthesize them as larger solution.
3. provide a general solution to the problem
4. specification of principle,textual and schematic
5. formal specification in the form of algorithm for the most pointed parts

## Plan

1. define a roadmap, with phases (or cycles, or sprints) and intermediate stages (sub-goals) of development to achieve the main goal (pass the defense)                                     
2.  estimate the volume of work of each phase and associated tasks
3. distribute this charge equitably, based on the skills and responsibilities of each member of the team
4. give yourself a provisional(临时的) calendar with milestones(里程碑) for the milestones and objectives to be achieved for it, collectively and individually
5. include in this agenda regular intermediate points of team,physical or remote, to make a point of progress on the current phase and specify the collective and individual objectives for the next sprint. A weekly frequency is a good frequency.



