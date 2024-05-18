# websocket-example

## NOTE:

- Next.js の API で、WebSocket を実装する場合、Page Router でしか実装できない
  - https://github.com/vercel/next.js/discussions/47782
  - https://github.com/socketio/socket.io/issues/4763
- https://socket.io/how-to/use-with-nextjs
  - アプリ起動と共に Socket 用のサーバーを起動するやり方もあるが微妙
- WebSocketServer の初期化で、明示的にポートを指定しないと接続できなかった
  - 参考にしたコードだと noServer オプションの指定のみ
    ```
    new WebSocketServer({ noServer: true })
    ```
