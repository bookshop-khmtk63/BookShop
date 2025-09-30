package com.example.backend.service.event;

import com.example.backend.event.UserRegisterEvent;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.model.KhachHang;
import com.example.backend.repository.KhachHangRepository;
import com.example.backend.repository.TokensRepository;
import com.example.backend.service.CustomerService;
import com.example.backend.service.TokensService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.core.token.TokenService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailNotificationService {
    private final CustomerService customerService;
    private final TokensService tokensService;
    private final JavaMailSenderImpl mailSender;

    public void sendToGmail(UserRegisterEvent userRegisterEvent) {
      log.info("Gửi tin nhắn đến gmail");
      switch (userRegisterEvent.getEventName()){

          case VERIFY:
              handleRegistration(userRegisterEvent);
              break;

          case RESET:
              handleForgotPassword(userRegisterEvent);
              break;
              default:
                  log.warn("Đã nhận loại sự kiện không xác định: {}", userRegisterEvent.getEventName());

      }
    }

    private void handleForgotPassword(UserRegisterEvent userRegisterEvent) {
        KhachHang customer = customerService.getCustomerByEmail(userRegisterEvent.getEmail());
        tokensService.createOtpToken(userRegisterEvent.getToken(),customer);
        String recipientEmail = userRegisterEvent.getEmail();
        String subject = "Mã OTP xác nhận tài khoản";
        StringBuilder message = new StringBuilder();
        message.append("Xin chào ").append(customer.getHoTen()).append(",\n\n");
        message.append("Mã OTP của bạn là: \n\n");
        message.append("👉 ").append(userRegisterEvent.getToken()).append(" 👈\n\n");
        message.append("Vui lòng nhập mã OTP này để hoàn tất xác thực. \n");
        message.append("Lưu ý: Mã OTP chỉ có hiệu lực trong 5 phút.\n\n");
        message.append("Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email.\n");
        // 4. Gửi email
        log.info("OTP gửi cho {} là {}", recipientEmail, userRegisterEvent.getToken());
        sendEmail(recipientEmail,subject,message.toString() );
    }

    private void handleRegistration(UserRegisterEvent userRegisterEvent) {

            KhachHang customer = customerService.getCustomerByEmail(userRegisterEvent.getEmail());
            tokensService.createVerificationTokenForUser(userRegisterEvent.getToken(),customer);
            String recipientEmail = userRegisterEvent.getEmail();
            String subject = "Xác nhận đăng ký tài khoản";
            String confirmationUrl = userRegisterEvent.getAppUrl()+"/api/auth/registerConfirmation?token=" + userRegisterEvent.getToken();
            log.info("url {}", confirmationUrl);
            String messageText = "Cảm ơn bạn đã đăng ký. Vui lòng nhấp vào liên kết bên dưới để kích hoạt tài khoản của bạn.\n:";
            sendEmail(recipientEmail,subject,messageText + "\r\n" +confirmationUrl);

    }

    private void sendEmail(String recipientEmail, String subject, String messageText) {
        try {
            SimpleMailMessage gmail = new SimpleMailMessage();
            gmail.setSubject(subject);
            gmail.setTo(recipientEmail);
            gmail.setText(messageText);
            mailSender.send(gmail);
            log.info("Gưi thành công yêu cầu xác thực đến địa chỉ : {}",recipientEmail);
        }catch (Exception e) {
            log.warn("Không thể gửi tin nhắn đển gmail: {}", recipientEmail);
            throw new RuntimeException("Gửi gmail thất bại đến  "+ recipientEmail,e);
        }
    }
}
