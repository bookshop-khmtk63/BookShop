//package com.example.backend.service;
//
////import com.example.backend.event.BookSyncEvent;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class KafkaProducerService {
//    private final KafkaTemplate<String, Object> kafkaTemplate;
//
////    public void sendBookSyncEvent(BookSyncEvent bookSyncEvent) {
////        log.info("Đang gửi sự kiện đồng bộ sách: {}", bookSyncEvent);
////        try {
////            kafkaTemplate.send("book-sync-event", String.valueOf(bookSyncEvent.getBookData().getId()), bookSyncEvent);
////            log.info("Đã gửi sự kiện thành công!");
////        }catch (Exception e) {
////            log.error("Lỗi khi gửi sự kiện đồng bộ sách: ", e);
////        }
////    }
//}
