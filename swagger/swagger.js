const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SabangKarsa API",
      version: "1.0.0",
      description: "Dokumentasi API untuk backend SabangKarsa (Jaksabang)",
    },
    servers: [
      {
        url: "https://jaksabangbe-production.up.railway.app", // Production
      },
      {
        url: "http://localhost:5000", // Local dev
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token untuk autentikasi pengguna.",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64c6..." },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            no_hp: { type: "string", example: "08123456789" },
            alamat: { type: "string", example: "Jl. Merdeka No.1" },
            role: { type: "string", enum: ["buyer", "seller"], example: "buyer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BookingPenginapan: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            penginapan: { type: "string" },
            check_in_date: { type: "string", format: "date" },
            check_out_date: { type: "string", format: "date" },
            jumlah_kamar: { type: "number" },
            total_harga: { type: "number" },
            status_pembayaran: { type: "string", enum: ["pending", "paid", "failed", "cancelled"] },
            payment_id: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BookingRental: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            rental: { type: "string" },
            tanggalMulai: { type: "string", format: "date" },
            tanggalSelesai: { type: "string", format: "date" },
            totalHarga: { type: "number" },
            payment_id: { type: "string" },
            status_pembayaran: { type: "string", enum: ["pending", "paid", "failed", "cancelled"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BookingTourGuide: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            tourGuide: { type: "string" },
            tanggalMulai: { type: "string", format: "date" },
            tanggalSelesai: { type: "string", format: "date" },
            lokasiJemput: { type: "string" },
            totalHarga: { type: "number" },
            payment_id: { type: "string" },
            status_pembayaran: { type: "string", enum: ["pending", "paid", "failed", "cancelled"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BookingPaket: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            penyedia: { type: "string" },
            paket: { type: "string", example: "Snorkeling" },
            tanggal: { type: "string", format: "date" },
            jumlahOrang: { type: "number" },
            totalHarga: { type: "number" },
            status: { type: "string", enum: ["pending", "dibayar", "selesai", "dibatalkan"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PaketWisata: {
          type: "object",
          properties: {
            _id: { type: "string" },
            penyedia: { type: "string" },
            nama: { type: "string" },
            deskripsi: { type: "string" },
            hargaPerOrang: { type: "number" },
            durasi: { type: "string", example: "2 jam" },
            gambar: { type: "string", example: "https://..." },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Penginapan: {
          type: "object",
          properties: {
            _id: { type: "string" },
            nama: { type: "string" },
            lokasi: { type: "string" },
            deskripsi: { type: "string" },
            namaPenyedia: { type: "string" },
            tipePeningapan: { type: "string", enum: ["hotel", "villa", "guest house", "resort", "homestay", "boutique hotel", "inn", "motel"] },
            hargaPerMalam: { type: "number" },
            gambar: { type: "string" },
            penyedia: { type: "string" },
            alamat: { type: "string" },
            no_telepon: { type: "string" },
            email: { type: "string" },
            jumlahKamarTersedia: { type: "number" },
            fasilitas: { type: "array", items: { type: "string" } },
            rating: { type: "number" },
            jumlah_review: { type: "number" },
            pemilik_id: { type: "string" },
            kebijakan: { type: "string" },
            check_in_time: { type: "string" },
            check_out_time: { type: "string" },
            lokasi_maps: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Rental: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            type: { type: "string", enum: ["motor", "mobil", "driver"] },
            harga: { type: "number" },
            deskripsi: { type: "string" },
            gambar: { type: "string" },
            penyedia: { type: "string" },
            namaPenyedia: { type: "string" },
            no_telepon: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        TourGuide: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            no_hp: { type: "string" },
            instagram: { type: "string" },
            kataKata: { type: "string" },
            wilayah: { type: "string" },
            harga: { type: "number" },
            foto: { type: "string" },
            penyedia: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        VerifikasiSeller: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            npwp: { type: "string" },
            ktp: { type: "string" },
            dokumenBisnis: { type: "string" },
            status: { type: "string", enum: ["pending", "approved", "rejected"] },
            catatan: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path ke semua file routes
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;