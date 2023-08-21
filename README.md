# Spyfall

**Spyfall**은 보드게임 스파이폴을 온라인에서 즐길 수 있게 만든 웹사이트입니다. <br />
사이트 주소: https://play-spyfall.web.app

## 기술 스택

- Node.js
- TypeScript
- React-redux
- Material UI
- Firebase

## 설치 방법

1. 저장소를 클론합니다.
   ```bash
   git clone https://github.com/AndroidNetrunner
   ```

2. 필요한 패키지를 설치합니다.
   ```bash
   npm install
   ```

3. 환경 변수를 설정합니다. (예: Firebase 설정)

4. 서버를 실행합니다.
   ```bash
   npm start
   ```

## 페이지별 설명

이 프로젝트는 총 3개의 페이지로 나뉩니다.

1. Entrance 페이지: 본인의 닉네임과, 생성 or 입장할 방을 결정하는 곳입니다.
2. Lobby 페이지: 입장 후 다른 참가자들을 기다려, 충분한 참가자들이 모이면 게임을 시작할 수 있습니다.
3. Game 페이지: Game을 진행하는 곳입니다. Game은 다시 2개의 Phase로 나뉩니다.
    1. QuestionPhase: 플레이어들이 질문과 답변을 하는 단계입니다. 8분의 제한시간이 끝나기 전까지, **의심스러운 플레이어를 고발**(플레이어 당 1회 제한)하거나 스파이가 **스스로 정체를 밝힐 수** 있습니다.
        - 누군가가 고발될 경우, 만장일치로 고발에 동의하면 즉시 게임이 종료됩니다.
            - 고발된 사람이 스파이였다면, 시민팀의 승리로 게임이 종료됩니다.
            - 고발된 사람이 무고한 시민이었다면, 스파이의 승리로 게임이 종료됩니다.
        - 스파이가 스스로 정체를 밝힐 경우, 주어진 장소를 추리할 수 있습니다.
            - 주어진 장소가 정답이라면, 스파이의 승리로 게임이 종료됩니다.
            - 주어진 장소가 오답이라면, 시민팀의 승리로 게임이 종료됩니다. 
    2. VotePhase: 8분이 제한시간이 지나면, **스파이로 가장 의심되는 사람을 투표**합니다.
        - 최다득표자가 1명일 경우, 올바르게 지목했다면 시민팀 승리, 아니라면 스파이가 승리합니다.
        - 최다득표자가 여러 명이라면, 최소 1명의 무고한 시민이 지목되었기에 스파이가 승리합니다.

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다. (`git checkout -b feature/YourFeatureName`)
3. 변경 사항을 커밋합니다. (`git commit -am 'Add some feature'`)
4. 브랜치에 푸시합니다. (`git push origin feature/YourFeatureName`)
5. Pull Request를 생성합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 연락처

- 이메일: kby9906@naver.com

## 참고

- [스파이폴 설명 영상](https://www.youtube.com/watch?v=vXh1SLF3c_M)
