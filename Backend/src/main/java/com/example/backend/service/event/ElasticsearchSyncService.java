//package com.example.backend.service.event;
//
//import com.example.backend.event.BookSyncEvent;
//import com.example.backend.model.BookElasticsearch;
//import com.example.backend.repository.BookElasticsearchRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Service;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//public class ElasticsearchSyncService {
//    private final BookElasticsearchRepository bookElasticsearchRepository;
//    @KafkaListener( topics = "book-sync-event", // Lắng nghe đúng topic
//            groupId = "shopbook-sync-group" )// Group ID đã định nghĩa trong properties
//    public void listenToBookSync(BookSyncEvent bookSyncEvent) {
//        log.info("Đã nhận được sự kiện đồng bộ: {}", bookSyncEvent);
//        BookElasticsearch bookData = bookSyncEvent.getBookData();
//        switch (bookSyncEvent.getEventType()){
//            case CREATE:
//                case UPDATE:
//                    log.info("Đang tạo/cập nhật document cho sách ID: {}", bookData.getId());
//                    bookElasticsearchRepository.save(bookData);
//                    break;
//        case DELETE:
//            log.info("Đang xóa document cho sách ID: {}", bookData.getId());
//        bookElasticsearchRepository.delete(bookData);
//        break;
//        default:
//            log.warn("Loại sự kiện không xác định: {}", bookSyncEvent.getEventType());
//            break;
//        }
//        log.info("Hoàn tất sự kiện đồng bộ");
//    }
//}
