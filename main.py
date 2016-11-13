import http.server
import os
import socketserver

PORT = int(os.getenv("PORT", 3000))

Handler = http.server.SimpleHTTPRequestHandler

httpd = socketserver.TCPServer(("", PORT), Handler)

print("Server listening on port %s" % PORT)
httpd.serve_forever()
