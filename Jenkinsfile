pipeline {
    agent any

    stages {
        stage('Build Backend Image') {
            steps {
                sh 'docker build --no-cache -t village-backend ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build --no-cache -t village-frontend ./frontend'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop village-backend || true
                docker rm village-backend || true

                docker stop village-frontend || true
                docker rm village-frontend || true

                docker run -d --name village-backend --network village-net \
                  -e AWS_REGION=ap-south-1 \
                  -e TABLE_BATCHES=LabourBatches \
                  -e TABLE_BOOKINGS=Bookings \
                  -v /root/.aws:/root/.aws:ro \
                  village-backend:latest

                docker run -d --name village-frontend --network village-net \
                  village-frontend:latest
                '''
            }
        }
    }
}
