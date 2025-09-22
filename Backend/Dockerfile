# Dockerfile (Đặt trong cùng thư mục với docker-compose.yml)

# Bắt đầu từ image Elasticsearch chính thức
FROM docker.elastic.co/elasticsearch/elasticsearch:8.11.1

# Cài đặt plugin analysis-icu để hỗ trợ phân tích ngôn ngữ (rất hữu ích cho tiếng Việt)
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin install analysis-icu