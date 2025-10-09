package com.example.backend.service.implement;

import com.example.backend.common.SearchOperation;
import com.example.backend.dto.request.CreateBookRequest;
import com.example.backend.dto.request.UpdateBookRequest;
import com.example.backend.dto.response.BookAdminResponse;
import com.example.backend.dto.response.BookDetailResponse;
import com.example.backend.dto.response.BookResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.BookMapper;
import com.example.backend.model.Book;
import com.example.backend.model.SearchCriteria;
import com.example.backend.model.TacGia;
import com.example.backend.model.TheLoai;
import com.example.backend.repository.SachRepository;
import com.example.backend.service.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookServiceImplement implements BookService {
    private final SachRepository sachRepository;
    private final BookMapper bookMapper;
    private final CategoryService categoryService;
    private final CloudinaryService cloudinaryService;
    private final AuthorService authorService;
    @Override
    public PageResponse<BookResponse> getAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Book> sach = sachRepository.findAll(pageable);
        List<BookResponse> bookResponseList = bookMapper.toBookResponseList(sach.getContent());
        return PageResponse.from(sach,bookResponseList);
    }

    @Override
    public BookDetailResponse getBookById(int id) {
        Book sach = sachRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.BOOK_NOT_FOUND));

        return bookMapper.toBookDetailResponse(sach);
    }

    @Override
    public PageResponse<BookResponse> filterBooks(Pageable pageable, List<String> filters) {
        List<SearchCriteria> criteriaList = new ArrayList<>();
        if (filters != null) {
            // SỬA LỖI REGEX TẠI ĐÂY
            Pattern pattern = Pattern.compile("([\\w.]+?)(:|>|<|>=|<=|==)([\\w\\s\\p{L}.-]+)");
            for (String filter : filters) {
                Matcher matcher = pattern.matcher(filter.trim());

                if (matcher.find()) {
                    String key = matcher.group(1);
                    String operator = matcher.group(2);
                    String value = matcher.group(3);

                    SearchOperation operation = mapOperator(operator);
                    if (operation != null) {
                        criteriaList.add(new SearchCriteria(key, operation, value));
                    }
                }
            }
        }

        Specification<Book> specification = SachSpecification.fromCriteria(criteriaList);

        Page<Book> sachPage = sachRepository.findAll(specification, pageable);

        List<BookResponse> bookResponses = sachPage.getContent()
                .stream()
                .map(bookMapper::toBookResponse)
                .toList();

        return PageResponse.from(sachPage,bookResponses);
    }

    @Override
    public PageResponse<BookResponse> advancedSearch(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Book> sach = sachRepository.searchByKeyWord(keyword,pageable);
        return PageResponse.from(sach,bookMapper.toBookResponseList(sach.getContent()));
    }

    @Override
    public PageResponse<BookAdminResponse> AdmingetAllBook(Pageable pageable) {
        Page<BookAdminResponse> book  = sachRepository.AdminGetAllBooks(pageable);
        return PageResponse.from(book,book.getContent());
    }

    @Override
    @Transactional
    public BookDetailResponse createBook(CreateBookRequest createBookRequest, MultipartFile thumbnail) {
        Set<TheLoai> category =  categoryService.getCategoryById(createBookRequest.getIdsCategory());
        String thumbnailUrl = null;
        if(thumbnail != null && !thumbnail.isEmpty()) {
            try {
                // Upload ảnh bìa
                Map thumbnailResult = cloudinaryService.uploadFile(thumbnail, "bookShop/thumbnails");
                thumbnailUrl = thumbnailResult.get("url").toString();
            } catch (IOException e) {
                log.error("Error uploading thumbnail to Cloudinary", e);
                throw new AppException(ErrorCode.FILE_UPLOAD_ERROR);
            }
        }
        TacGia author = authorService.getAuthorById(createBookRequest.getIdAuthor());
        Book sach = Book.builder()
                .tenSach(createBookRequest.getNameBook())
                .gia(createBookRequest.getPrice())
                .anhSach(thumbnailUrl)
                .moTa(createBookRequest.getDescription())
                .soLuong(createBookRequest.getQuantity())
                .danhSachTheLoai(category)
                .tacGia(author)
                .build();
        sachRepository.save(sach);
        return bookMapper.toBookDetailResponse(sach);
    }

    @Override
    @Transactional
    public BookDetailResponse updateBook(UpdateBookRequest updateBookRequest, MultipartFile thumbnail, int id) {
        Book book = sachRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // 2. CẬP NHẬT CÁC TRƯỜNG ĐƠN GIẢN:
        Optional.ofNullable(updateBookRequest.getNameBook())
                .ifPresent(name -> { if (!name.isBlank()) book.setTenSach(name); });

        Optional.ofNullable(updateBookRequest.getDescription())
                .ifPresent(book::setMoTa);

        Optional.ofNullable(updateBookRequest.getPrice())
                .ifPresent(book::setGia);

        Optional.ofNullable(updateBookRequest.getQuantity())
                .ifPresent(book::setSoLuong);

        if (updateBookRequest.getIdsCategory() != null) {

            Set<TheLoai> newCategories = categoryService.getCategoryById(updateBookRequest.getIdsCategory());

            book.setDanhSachTheLoai(newCategories);
        }

        if (updateBookRequest.getIdAuthor() != null) {
            TacGia newAuthor = authorService.getAuthorById(updateBookRequest.getIdAuthor());
            book.setTacGia(newAuthor);
        }
        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {

                // cloudinaryService.deleteFile(book.getPublicIdFromUrl());

                Map thumbnailResult = cloudinaryService.uploadFile(thumbnail, "bookShop/thumbnails");
                String thumbnailUrl = thumbnailResult.get("url").toString();
                book.setAnhSach(thumbnailUrl);
            } catch (IOException e) {
                log.error("Lỗi khi upload ảnh bìa lên Cloudinary", e);
                throw new AppException(ErrorCode.FILE_UPLOAD_ERROR);
            }
        }
        return bookMapper.toBookDetailResponse(book);
    }

    @Override
    public void deleteBook(Integer id) {
        if(!sachRepository.existsById(id)) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        sachRepository.deleteById(id);
    }


    private SearchOperation mapOperator(String operator) {
        switch (operator) {
            case "==": return SearchOperation.EQUAL;
            case ":":  return SearchOperation.LIKE;
            case ">":  return SearchOperation.GREATER_THAN;
            case "<":  return SearchOperation.LESS_THAN;
            case ">=": return SearchOperation.GREATER_THAN_OR_EQUAL;
            case "<=": return SearchOperation.LESS_THAN_OR_EQUAL;
            default:   return null;
        }
    }
}
