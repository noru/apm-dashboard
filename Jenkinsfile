#!groovy

// Define DevCloud Artifactory for publishing non-docker image artifacts
def artUploadServer = Artifactory.server('devcloud')

// Change Snapshot to your own DevCloud Artifactory repo name
def Snapshot = 'PROPEL'

pipeline {
    agent none
    options {
        buildDiscarder(logRotator(artifactDaysToKeepStr: '1', artifactNumToKeepStr: '1', daysToKeepStr: '5', numToKeepStr: '10'))
    }
    stages {
        stage ('Build') {
          agent {
              docker {
                  image 'repo.ci.build.ge.com:8443/predixci-node6.9-base'
                  label 'dind'
              }
          }
          environment {
              CACHING_REPO_URL = 'https://repo.ci.build.ge.com/artifactory/api/npm/npm-virtual/'
          }
          steps {
              sh 'npm config set strict-ssl false'
              sh "npm config set registry $CACHING_REPO_URL"
              sh 'npm install'
              sh 'npm run build'
              sh 'zip -r build.zip ./build'
              stash includes: '*.zip', name: 'artifact'
          }
          post {
              success {
                  echo 'Build stage completed'
              }
              failure {
                  echo 'Build stage failed'
              }
          }
        }

        stage ('Deploy') {
          steps {
            sh 'echo 123'
          }
          post {
              success {
                  echo 'Deploy to Cloud Foundry stage completed'
              }
              failure {
                  echo 'Deploy to Cloud Foundry stage failed'
              }
          }
        }
    }
    post {
        success {
            echo 'Build completed'
        }
        failure {
            echo 'Build failed'
        }
    }

}