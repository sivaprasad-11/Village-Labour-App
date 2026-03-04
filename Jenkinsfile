pipeline {

agent any

stages {

stage('Clone Repo') {

steps {

git 'https://github.com/sivaprasad-11/Village-Labour-App'

}

}

stage('Build Backend Image') {

steps {

sh 'docker build -t backend backend'

}

}

stage('Build Frontend Image') {

steps {

sh 'docker build -t frontend frontend'

}

}

stage('Deploy') {

steps {

sh 'docker compose -f deploy/docker-compose.prod.yml up -d'

}

}

}

}