pipeline {
    agent any
    environment{
        TOKEN = credentials('telegramToken')
        CHAT_ID = credentials('telegramChat_id')

        // Telegram Message Success and Failure
        TEXT_SUCCESS_BUILD = "${env.JOB_NAME} is built with number of ${env.BUILD_NUMBER} SUCCESSFULLY"
        TEXT_FAILURE_BUILD = "${env.JOB_NAME} is built with number ${env.BUILD_NUMBER} FAILURE \nMore info at: ${env.BUILD_URL}"
    }
    stages {
        stage('Build-Images') {
            steps {
                sh "docker build -t bixso-backend-devtest-internalapp-internalapp:${BUILD_NUMBER} ."
            }
        }
        stage('SSH-Remote-Deploy'){
            steps
            {
            sh "docker save -o bixso-backend-devtest-internalapp.tar bixso-backend-devtest-internalapp:${BUILD_NUMBER}"

            sshPublisher(publishers: [sshPublisherDesc(configName: 'xeoi-bankend-devtest',
            transfers: [sshTransfer(cleanRemote: false, excludes: '',
            execCommand: "docker rm -f bixso-backend-devtest-internalapp;docker rmi \$(docker images -a -q);docker load -i bixso-backend-devtest-internalapp.tar;docker run -idt --name bixso-backend-devtest-internalapp -p 8001:8001 bixso-backend-devtest-internalapp:${BUILD_NUMBER}",
            //execCommand: "docker ps",
            execTimeout: 120000,
            flatten: false, makeEmptyDirs: false,
            noDefaultExcludes: false, patternSeparator: '[, ]+',
            remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '',
            sourceFiles: 'bixso-backend-devtest-internalapp.tar')],usePromotionTimestamp: false,
            useWorkspaceInPromotion: false,verbose: true)])
            }
            }

    }
post {
        always {
            echo 'One way or another, I have finished'
            deleteDir() /* clean up our workspace */
        }
        success {
            script{
                sh "curl --location --request POST 'https://api.telegram.org/bot${TOKEN}/sendMessage' --form text='${TEXT_SUCCESS_BUILD}' --form chat_id='${CHAT_ID}'"
            }
        }
        failure {
            script{
                sh "curl --location --request POST 'https://api.telegram.org/bot${TOKEN}/sendMessage' --form text='${TEXT_FAILURE_BUILD}' --form chat_id='${CHAT_ID}'"
            }
    }

}
}