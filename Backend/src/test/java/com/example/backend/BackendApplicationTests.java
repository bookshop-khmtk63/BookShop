package com.example.backend;

import com.example.backend.common.EventType;
import com.example.backend.common.Role;
//import com.example.backend.event.BookSyncEvent;
import com.example.backend.mapper.BookMapper;
import com.example.backend.model.*;
import com.example.backend.repository.*;
//import com.example.backend.service.KafkaProducerService;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
//import org.apache.kafka.clients.producer.KafkaProducer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private TheLoaiRepository theLoaiRepository;

    @Autowired
    private SachRepository sachRepository;

    @Autowired
    private DanhGiaSachRepository danhGiaSachRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inject bean để mã hóa mật khẩu
   // @Autowired
    //private KafkaProducerService kafkaProducer;

    @Autowired
    private BookMapper bookMapper;
    @Autowired
    private TacGiaRepository tacGiaRepository;
   // @Autowired
    //private BookElasticsearchRepository bookElasticsearchRepository;
    private final Faker faker = new Faker();

    @Test
    @Order(1) // Chạy đầu tiên
    void generate_fake_the_loai() {
        System.out.println("Generating categories...");
        String[] categoryNames = {
                "Tiểu thuyết", "Khoa học viễn tưởng", "Tự truyện", "Lịch sử",
                "Trinh thám", "Tâm lý học", "Kinh doanh", "Kỹ năng sống",
                "Triết học", "Văn học cổ điển", "Công nghệ thông tin", "Ngoại ngữ"
        };

        for (String ten : categoryNames) {
            if (!theLoaiRepository.existsByTenTheLoai(ten)) {
                TheLoai theLoai = TheLoai.builder()
                        .tenTheLoai(ten)
                        .moTa(faker.lorem().paragraph(2))
                        .build();
                theLoaiRepository.save(theLoai);
            }
        }
        System.out.println("Generated categories successfully!");
    }

    @Test
    @Order(2) // Chạy thứ hai
    void generate_fake_khach_hang() {
        System.out.println("Generating customers...");
        for (int i = 0; i < 50; i++) {
            String email;
            do {
                email = faker.internet().emailAddress();
            } while (khachHangRepository.existsByEmail(email));

            String soDienThoai;
            do {
                soDienThoai = faker.phoneNumber().cellPhone();
            } while (khachHangRepository.existsBySoDienThoai(soDienThoai));

            KhachHang khachHang = KhachHang.builder()
                    .hoTen(faker.name().fullName())
                    .email(email)
                    .matKhau(passwordEncoder.encode("123456")) // Mật khẩu mặc định, đã mã hóa
                    .diaChi(faker.address().fullAddress())
                    .soDienThoai(soDienThoai)
                    .active(true)
                    .locked(false)
                    .role(i == 0 ? Role.ADMIN : Role.USER) // Người đầu tiên là admin
                    .build();
            khachHangRepository.save(khachHang);
        }
        System.out.println("Generated customers successfully!");
    }

    @Test
    @Order(4) // Chạy thứ ba, sau khi đã có thể loại
    void generate_fake_sach() {
        System.out.println("Generating books...");
        List<TheLoai> allTheLoai = theLoaiRepository.findAll();
        List<TacGia> allTacGia = tacGiaRepository.findAll();

        if (allTheLoai.isEmpty()) {
            System.out.println("No categories found. Skipping book generation.");
            return;
        }

        for (int i = 0; i < 200; i++) {
            String tenSach = faker.book().title();
            String tenTacGia = faker.book().author();

            Collections.shuffle(allTheLoai);
            int categoryCount = faker.number().numberBetween(1, 4);
            Set<TheLoai> danhSachTheLoai = new HashSet<>(allTheLoai.subList(0, Math.min(categoryCount, allTheLoai.size())));
            TacGia randomTacGia = allTacGia.get(faker.number().numberBetween(0, allTacGia.size()));
            Sach sachToSave = Sach.builder()
                    .tenSach(tenSach)
                    .gia(new BigDecimal(faker.commerce().price(50000, 500000)))
                    .soLuong(faker.number().numberBetween(0, 30))
                    .tacGia(randomTacGia)
                    .anhSach("https://placehold.co/600x400?text=" + tenSach.replaceAll("[^a-zA-Z0-9]", "+"))
                    .moTa(faker.lorem().paragraph(5))
                    .diemTrungBinh(0.0)
                    .danhSachTheLoai(danhSachTheLoai)
                    .build();

            // Bước 1: Lưu 'Sach' vào DB. Phương thức save() sẽ trả về
            // đối tượng Sach đã được cập nhật với ID.
            Sach savedSach = sachRepository.save(sachToSave);

            // Bước 2: BÂY GIỜ savedSach.getIdSach() đã có giá trị.
            // Sử dụng đối tượng đã được lưu để mapping.
//            BookElasticsearch bookElasticsearch = bookMapper.toBookElasticsearch(savedSach);
//
//            // Bước 3: Gửi sự kiện Kafka với dữ liệu đã đầy đủ.
//            BookSyncEvent bookSyncEvent = BookSyncEvent.builder()
//                    .eventType(EventType.CREATE)
//                    .bookData(bookElasticsearch)
//                    .build();
//            kafkaProducer.sendBookSyncEvent(bookSyncEvent);
        }

        System.out.println("Generated books successfully!");
    }
    @Test
    @Order(3) // CHẠY ĐẦU TIÊN
    void generate_fake_tac_gia() {
        System.out.println("Generating authors...");
        for (int i = 0; i < 50; i++) {
            if (tacGiaRepository.count() >= 50) break;
            TacGia tacGia = new TacGia();
            tacGia.setTenTacGia(faker.book().author());
            tacGia.setTieuSu(faker.lorem().paragraph(3));
            tacGiaRepository.save(tacGia);
        }
        System.out.println("Generated authors successfully!");
    }
    @Test
    @Order(5) // Chạy cuối cùng, sau khi mọi thứ đã sẵn sàng
    void generate_fake_danh_gia_sach_and_update_ratings() {
        System.out.println("Generating reviews and updating ratings...");
        List<KhachHang> allKhachHang = khachHangRepository.findAll();
        List<Sach> allSach = sachRepository.findAll();

        if (allKhachHang.isEmpty() || allSach.isEmpty()) {
            System.out.println("No customers or books found. Skipping review generation.");
            return;
        }

        int reviewsToGenerate = 300;
        for (int i = 0; i < reviewsToGenerate; i++) {
            Sach randomSach;
            KhachHang randomKhachHang;
            String reviewKey;

            // Vòng lặp để đảm bảo không tạo đánh giá trùng lặp
            do {
                randomKhachHang = allKhachHang.get(faker.number().numberBetween(0, allKhachHang.size()));
                randomSach = allSach.get(faker.number().numberBetween(0, allSach.size()));
                reviewKey = randomKhachHang.getIdKhachHang() + "-" + randomSach.getIdSach();
            } while (danhGiaSachRepository.existsByKhachHangAndSach(randomKhachHang, randomSach));

            // Tạo và lưu đánh giá mới
            DanhGiaSach danhGia = DanhGiaSach.builder()
                    .khachHang(randomKhachHang)
                    .sach(randomSach)
                    .diemXepHang(faker.number().numberBetween(1, 6)) // 1 đến 5
                    .binhLuan(faker.lorem().sentence(10))
                    .build();
            danhGiaSachRepository.save(danhGia);

            // CẬP NHẬT ĐIỂM TRUNG BÌNH CHO SÁCH VỪA ĐƯỢC ĐÁNH GIÁ
            // Lấy tất cả điểm của sách này và tính trung bình
            List<DanhGiaSach> reviewsForBook = danhGiaSachRepository.findBySach(randomSach);
            double averageRating = reviewsForBook.stream()
                    .mapToInt(DanhGiaSach::getDiemXepHang)
                    .average()
                    .orElse(0.0);

            // Làm tròn đến 1 chữ số thập phân
            averageRating = Math.round(averageRating * 10.0) / 10.0;

            randomSach.setDiemTrungBinh(averageRating);
            sachRepository.save(randomSach); // Lưu lại sách với điểm mới
        }
        System.out.println("Generated " + reviewsToGenerate + " reviews and updated ratings successfully!");
    }
}

