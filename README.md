This is a video transcoding React app that allows users to upload their videos, transcode videos from MOV to MP4, and download the transcoded video.
The app is designed using microservices architecture. The CPU-intensive video transcoding service is separated the main app. It is specially designed to be deployed 
on cloud (e.g. AWS) by taking advantage of its scalability to achieve higher performace and better user experience.

Tech used:
- React.js
- Node.js
- Tailwind CSS
- AWS (EC2, Cognito, DynamoDB, S3, ALB, Route53, etc)
- Docker
